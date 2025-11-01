import { NextResponse } from 'next/server';

// Registration endpoint disabled. Returning 404 to prevent public registration.
export async function POST() {
  return NextResponse.json({ success: false, error: 'Not Found' }, { status: 404 });
}
