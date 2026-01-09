import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

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

async function verifyAdmin(request) {
  const cookie = request.headers.get('cookie');
  const token = parseCookie(cookie);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN') return null;
    return decoded;
  } catch {
    return null;
  }
}

// GET /api/admin/ads - List all ads (for admin)
export async function GET(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const ads = await prisma.advertisement.findMany({
      orderBy: [
        { position: 'asc' },
        { order: 'asc' }
      ]
    });

    return NextResponse.json({ success: true, data: ads });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/ads - Create new ad
export async function POST(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, linkUrl, title, position, order, active } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'Image URL is required' }, { status: 400 });
    }

    const ad = await prisma.advertisement.create({
      data: {
        imageUrl,
        linkUrl,
        title,
        position: position || 'side',
        order: order || 0,
        active: active !== undefined ? active : true
      }
    });

    return NextResponse.json({ success: true, data: ad });
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
