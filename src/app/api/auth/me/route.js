import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

function parseCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map(p => p.trim());
  for (const part of parts) {
    if (part.startsWith('token=')) return part.replace('token=', '');
  }
  return null;
}

// GET /api/auth/me
export async function GET(request) {
  try {
    const cookie = request.headers.get('cookie');
    const token = parseCookie(cookie);
    if (!token) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, role: true } });
    if (!user) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    console.error('Me error', err);
    return NextResponse.json({ success: false, error: 'Not authenticated', message: err.message }, { status: 401 });
  }
}
