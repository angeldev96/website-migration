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
    const decoded = jwt.verifyUnsafe ? jwt.verifyUnsafe(token) : jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN') return null;
    return decoded;
  } catch {
    return null;
  }
}

// PATCH /api/admin/ads/[id] - Update ad
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const adId = parseInt(id);

    const updatedAd = await prisma.advertisement.update({
      where: { id: adId },
      data: body
    });

    return NextResponse.json({ success: true, data: updatedAd });
  } catch (error) {
    console.error('Error updating ad:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/ads/[id] - Delete ad
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const adId = parseInt(id);

    await prisma.advertisement.delete({
      where: { id: adId }
    });

    return NextResponse.json({ success: true, message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Error deleting ad:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
