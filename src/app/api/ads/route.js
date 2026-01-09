import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/ads - Publicly available ads
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');

    const where = { active: true };
    if (position) {
      where.position = position;
    }

    const ads = await prisma.advertisement.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ success: true, data: ads });
  } catch (error) {
    console.error('Error fetching public ads:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch advertisements' }, { status: 500 });
  }
}
