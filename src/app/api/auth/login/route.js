import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

function createCookie(token) {
  const secure = process.env.NODE_ENV === 'production';
  // 7 days
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  return `token=${token}; Expires=${expires}; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

// POST /api/auth/login
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
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
    console.error('Login error', err);
    return NextResponse.json({ success: false, error: 'Login failed', message: err.message }, { status: 500 });
  }
}
