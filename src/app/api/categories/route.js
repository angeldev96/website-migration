import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

// GET /api/categories - Get all unique categories with job counts
export async function GET(request) {
  try {
    // Get categories with counts
    const categories = await db.getCategoriesWithCounts(1000);

    // Format the response
    const formattedCategories = categories.map(cat => ({
      name: cat.category,
      count: cat.count,
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
