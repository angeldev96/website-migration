import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

// POST /api/search - Advanced job search
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      keyword, 
      location, 
      category, 
      genderCategory,
      page = 1, 
      limit = 20 
    } = body;
    
    const skip = (page - 1) * limit;
    const where = {};
    
    // Keyword search (in title, description, company)
    if (keyword && keyword.trim()) {
      where.OR = [
        {
          jobTitle: {
            contains: keyword.trim(),
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: keyword.trim(),
            mode: 'insensitive'
          }
        },
        {
          company: {
            contains: keyword.trim(),
            mode: 'insensitive'
          }
        },
        {
          aiTitle: {
            contains: keyword.trim(),
            mode: 'insensitive'
          }
        },
        {
          aiDescription: {
            contains: keyword.trim(),
            mode: 'insensitive'
          }
        }
      ];
    }
    
    // Location search (in description or other location fields)
    if (location && location.trim()) {
      where.description = {
        contains: location.trim(),
        mode: 'insensitive'
      };
    }
    
    // Category filter
    if (category && category !== 'all') {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }
    
    // Gender category filter
    if (genderCategory && genderCategory !== 'all') {
      where.genderCategory = {
        equals: genderCategory,
        mode: 'insensitive'
      };
    }
    
    // Basic search fallback: use the standard paginated listing for now.
    // Advanced search with full-text/ILIKE filters can be implemented later.
    const total = await db.countAllJobs();
    const jobs = await db.findJobsBasic({ skip, take: limit });
    
    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        keyword,
        location,
        category,
        genderCategory
      }
    });
    
  } catch (error) {
    console.error('Error searching jobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search jobs',
        message: error.message
      },
      { status: 500 }
    );
  }
}
