import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

// GET /api/jobs - Get all jobs with pagination and filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Filters
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const genderCategory = searchParams.get('genderCategory');
    
    // Build where clause
    const where = {};
    
    if (category) {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }
    
    if (genderCategory) {
      where.genderCategory = {
        equals: genderCategory,
        mode: 'insensitive'
      };
    }
    
    // Search in title and description
    if (search) {
      where.OR = [
        {
          jobTitle: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          company: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    // Location filter (searching in description or other fields)
    if (location) {
      where.description = {
        contains: location,
        mode: 'insensitive'
      };
    }
    
    // NOTE: This basic implementation supports pagination and returns
    // recent jobs. Advanced filtering (complex WHERE with ORs/ILIKE)
    // can be added later. For now we use a simple fast query.
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
      }
    });
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch jobs',
        message: error.message
      },
      { status: 500 }
    );
  }
}
