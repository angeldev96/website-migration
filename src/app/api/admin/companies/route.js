import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/admin/companies - List all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        logoUrl: true
      }
    });

    return NextResponse.json({ success: true, companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST /api/admin/companies - Create new company
export async function POST(request) {
  try {
    const { name, logoUrl } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }

    const company = await prisma.company.create({
      data: {
        name: name.trim(),
        logoUrl: logoUrl?.trim() || null
      }
    });

    return NextResponse.json({ success: true, company });
  } catch (error) {
    console.error('Error creating company:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Company name already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create company' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/companies - Update company logo
export async function PATCH(request) {
  try {
    const { id, logoUrl } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const company = await prisma.company.update({
      where: { id: parseInt(id) },
      data: { logoUrl: logoUrl?.trim() || null }
    });

    return NextResponse.json({ success: true, company });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update company' },
      { status: 500 }
    );
  }
}
