import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function orderByForAds() {
  return [{ order: 'asc' }, { id: 'asc' }];
}

function splitSideAds(sideAds, side) {
  const startIndex = side === 'right-side' ? 1 : 0;
  return sideAds.filter((_, index) => index % 2 === startIndex);
}

// GET /api/ads - Publicly available ads
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const limitParam = searchParams.get('limit');

    const defaultLimit = position === 'horizontal' ? 1 : 12;
    const limit = Math.max(
      1,
      Math.min(50, Number.isFinite(Number(limitParam)) ? Number(limitParam) : defaultLimit)
    );

    const where = { active: true };

    // Backwards-compat + left/right independence:
    // - New: left-side/right-side/horizontal
    // - Legacy: side (single pool)
    if (!position) {
      const ads = await prisma.advertisement.findMany({
        where,
        orderBy: orderByForAds(),
        take: limit
      });
      return NextResponse.json({ success: true, data: ads });
    }

    if (position === 'left-side' || position === 'right-side') {
      const directPositions = position === 'left-side'
        ? ['left-side', 'left']
        : ['right-side', 'right'];

      let ads = await prisma.advertisement.findMany({
        where: { ...where, position: { in: directPositions } },
        orderBy: orderByForAds(),
        take: limit
      });

      // If there are no explicit left/right ads yet, fall back to legacy "side" ads
      // and split them deterministically between left and right.
      if (ads.length === 0) {
        const sideAds = await prisma.advertisement.findMany({
          where: { ...where, position: { in: ['side'] } },
          orderBy: orderByForAds()
        });
        ads = splitSideAds(sideAds, position).slice(0, limit);
      }

      return NextResponse.json({ success: true, data: ads });
    }

    const ads = await prisma.advertisement.findMany({
      where: { ...where, position },
      orderBy: orderByForAds(),
      take: limit
    });

    return NextResponse.json({ success: true, data: ads });
  } catch (error) {
    console.error('Error fetching public ads:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch advertisements' }, { status: 500 });
  }
}
