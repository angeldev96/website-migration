import { NextResponse } from 'next/server';

/**
 * Middleware para configurar seguridad y CORS
 * Este middleware se ejecuta antes de cada request
 */
export function middleware(request) {
  // Obtener el origen del request
  const origin = request.headers.get('origin');
  
  // Lista de orígenes permitidos (actualiza esto con tu dominio real)
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    // Agrega aquí dominios de producción permitidos, ej:
    // 'https://yiddishjobs.com',
    // 'https://www.yiddishjobs.com',
  ];
  
  // Para desarrollo, permitir cualquier origen
  // Para producción, REEMPLAZA esto con tu dominio específico
  const isAllowedOrigin = process.env.NODE_ENV === 'development' 
    ? true 
    : allowedOrigins.includes(origin);
  
  // Crear respuesta
  const response = NextResponse.next();
  
  // Headers CORS
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', origin || '*');
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Cookie'
  );
  
  // Headers de seguridad adicionales
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (restrict sources of scripts, styles, images, etc.)
  // Nota: Ajusta esto según tus necesidades específicas
  // IMPORTANT: Agregado Microsoft Clarity para analítica
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.prod.website-files.com https://www.clarity.ms https://clarity.ms",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss: https://www.clarity.ms https://clarity.ms",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  // Permisos de navegador
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // HSTS (solo en HTTPS)
  if (request.url.startsWith('https://')) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }
  
  // Para pre-OPTIONS requests (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200,
      headers: response.headers
    });
  }
  
  return response;
}

/**
 * Configurar qué rutas pasa el middleware
 * Puedes excluir rutas públicas que no necesitan protección
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

