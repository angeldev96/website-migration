import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

/**
 * Verifica si el JWT_SECRET está configurado correctamente en producción
 * @returns {string} JWT_SECRET value
 * @throws {Error} If JWT_SECRET is not set in production
 */
export function validateJWTSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET || JWT_SECRET === 'change-me') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL: JWT_SECRET must be set in production');
    }
    console.warn('WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable in production!');
  }
  
  return JWT_SECRET;
}

/**
 * Verifica el token JWT y retorna el usuario autenticado
 * @returns {Object|null} User object if authenticated, null otherwise
 */
export async function authenticate() {
  try {
    validateJWTSecret();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    
    // Verificar que el usuario aún existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    // Token inválido o expirado
    if (error.name === 'JsonWebTokenError') {
      console.warn('Invalid JWT token attempt');
    } else if (error.name === 'TokenExpiredError') {
      console.warn('Expired JWT token attempt');
    } else {
      console.error('Authentication error:', error.message);
    }
    return null;
  }
}

/**
 * Verifica que el usuario sea administrador
 * @returns {Object|null} Admin user if authenticated and admin, null otherwise
 */
export async function requireAdmin() {
  try {
    validateJWTSecret();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });
    
    if (!user || user.role !== 'ADMIN') {
      console.warn(`Unauthorized admin access attempt by user ID: ${decoded?.userId || 'unknown'}`);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Admin verification error:', error.message);
    return null;
  }
}

/**
 * Crea una respuesta de error de autenticación
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {NextResponse}
 */
export function createAuthErrorResponse(message = 'Unauthorized', status = 401) {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { 
      status, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

/**
 * Wrapper para proteger rutas de API que requieren autenticación
 * @param {Function} handler - El handler de la ruta API
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.requireAdmin - Si se requiere rol de admin
 * @returns {Function} Handler protegido
 */
export function withAuth(handler, options = {}) {
  const { requireAdmin: requireAdminRole = false } = options;
  
  return async (request, ...args) => {
    try {
      validateJWTSecret();
      
      const user = requireAdminRole 
        ? await requireAdmin() 
        : await authenticate();
      
      if (!user) {
        return createAuthErrorResponse(
          requireAdminRole ? 'Admin access required' : 'Not authenticated',
          401
        );
      }
      
      // Agregar el usuario al request para uso en el handler
      request.user = user;
      
      return handler(request, ...args);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return createAuthErrorResponse('Internal server error', 500);
    }
  };
}

/**
 * Rate limiting en memoria (simple para implementar)
 * Para producción, usa Redis o similar
 */
const rateLimitStore = new Map();

/**
 * Verifica rate limiting
 * @param {string} key - Clave única (IP o email)
 * @param {number} maxRequests - Máximo de peticiones
 * @param {number} windowMs - Ventana de tiempo en milisegundos
 * @returns {Object} { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(key, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Limpiar entradas viejas
  for (const [k, data] of rateLimitStore.entries()) {
    if (data.timestamp < windowStart) {
      rateLimitStore.delete(k);
    }
  }
  
  const record = rateLimitStore.get(key);
  
  if (!record) {
    // Primer request en la ventana
    rateLimitStore.set(key, {
      count: 1,
      timestamp: now,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  // Dentro de la ventana actual
  if (record.timestamp < windowStart) {
    // Ventana antigua, reiniciar
    rateLimitStore.set(key, {
      count: 1,
      timestamp: now,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }
  
  // Siguiente request en la misma ventana
  if (record.count >= maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: record.resetTime 
    };
  }
  
  record.count++;
  return { 
    allowed: true, 
    remaining: maxRequests - record.count, 
    resetTime: record.resetTime 
  };
}

/**
 * Obtiene la IP del cliente
 * @param {Request} request - Next.js Request object
 * @returns {string} Client IP address
 */
export function getClientIP(request) {
  // Intentar obtener de varias fuentes de headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return 'unknown';
}

/**
 * Sanitiza input para prevenir ataques básicos
 * @param {string} input - Input a sanitizar
 * @returns {string} Input sanitizado
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Eliminar caracteres peligrosos
  return input
    .trim()
    .replace(/[<>]/g, '') // Eliminar < y >
    .replace(/javascript:/gi, '') // Eliminar javascript:
    .replace(/on\w+=/gi, ''); // Eliminar onmouseover=, onclick=, etc.
}

/**
 * Valida email básico
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Log de seguridad - para monitorear intentos sospechosos
 * @param {string} event - Tipo de evento
 * @param {Object} details - Detalles del evento
 */
export function logSecurityEvent(event, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ...details
  };
  
  console.error('SECURITY EVENT:', JSON.stringify(logEntry));
  
  // En producción, enviar esto a un servicio de logs
  // como Sentry, LogRocket, o similar
}

