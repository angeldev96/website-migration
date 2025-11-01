import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const JWT_SECRET = process.env.JWT_SECRET;
  const nodeEnv = process.env.NODE_ENV || 'development';

  const result = {
    nodeEnv,
    jwtPresent: Boolean(JWT_SECRET),
    jwtSample: typeof JWT_SECRET === 'string' ? (JWT_SECRET.length ? 'present' : 'empty') : 'undefined',
  };

  try {
    // simple DB ping
    await prisma.$queryRaw`SELECT 1`;
    result.db = 'ok';
  } catch (err) {
    result.db = 'error';
    result.dbError = err?.message || String(err);
  }

  // return non-sensitive summary
  return NextResponse.json({ success: true, data: result });
}
