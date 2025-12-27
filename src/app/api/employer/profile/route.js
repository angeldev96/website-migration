import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    if (user.role !== 'CORPORATION' && user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    if (!user.companyId) {
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json({ success: true, data: user.company });
  } catch (error) {
    console.error('Employer profile GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    if (user.role !== 'CORPORATION' && user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, logoUrl } = body;

    if (!user.companyId) {
      // Create new company and link to user
      const newCompany = await prisma.company.create({
        data: {
          name: name || `Company for ${user.email}`,
          logoUrl: logoUrl || null,
          users: {
            connect: { id: user.id }
          }
        }
      });
      return NextResponse.json({ success: true, data: newCompany });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: user.companyId },
      data: {
        name: name || undefined,
        logoUrl: logoUrl || undefined,
      },
    });

    return NextResponse.json({ success: true, data: updatedCompany });
  } catch (error) {
    console.error('Employer profile PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
