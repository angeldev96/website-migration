import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkRateLimit, getClientIP, logSecurityEvent } from '@/lib/authMiddleware';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

// Validar que JWT_SECRET esté configurado en producción
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET === 'change-me') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL SECURITY: JWT_SECRET environment variable must be set in production');
  }
  console.error('SECURITY WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable!');
}

function createCookie(token) {
  const secure = process.env.NODE_ENV === 'production';
  // 7 days
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  return `token=${token}; Expires=${expires}; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

// POST /api/auth/login
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }
    
    // Rate limiting para prevenir fuerza bruta
    const ip = getClientIP(request);
    const rateLimitResult = checkRateLimit(`login:${email}`, 5, 300000); // 5 intentos por 5 minutos por email
    
    if (!rateLimitResult.allowed) {
      logSecurityEvent('LOGIN_RATE_LIMIT_EXCEEDED', { 
        email, 
        ip,
        attempts: 5
      });
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
          }
        }
      );
    }

    // Quick runtime checks (helpful for production debugging)
    try {
      console.error('DEBUG: JWT_SECRET present?', !!JWT_SECRET);
      // simple DB ping to reveal connection problems early
      await prisma.$queryRaw`SELECT 1`;
    } catch (pingErr) {
      console.error('DEBUG: DB ping failed:', pingErr && pingErr.message);
      return NextResponse.json({ success: false, error: 'Database connection failed', message: pingErr?.message }, { status: 500 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const res = NextResponse.json({ success: true, data: { id: user.id, email: user.email, role: user.role } });
    res.headers.set('Set-Cookie', createCookie(token));
    return res;
  } catch (err) {
    console.error('Login error', err && err.stack ? err.stack : err);
    return NextResponse.json({ success: false, error: 'Login failed', message: err?.message || String(err) }, { status: 500 });
  }
}
