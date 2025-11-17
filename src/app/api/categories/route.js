import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

// GET /api/categories - Get all unique categories with job counts
export async function GET(request) {
  try {
    // Get all unique categories with counts
    const categories = await prisma.jobsSheet.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });
    
    // Format the response
    const formattedCategories = categories.map(cat => ({
      name: cat.category,
      count: cat._count.id,
      slug: cat.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
    }));
    
    return NextResponse.json({
      success: true,
      data: formattedCategories,
      total: formattedCategories.length
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: error.message
      },
      { status: 500 }
    );
  }
}
