import { NextResponse } from 'next/server';

// POST /api/auth/logout
export async function POST() {
  const res = NextResponse.json({ success: true });
  // Expire cookie
  res.headers.set('Set-Cookie', `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
  return res;
}
