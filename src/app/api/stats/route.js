import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

// GET /api/stats - Get website statistics
export async function GET(request) {
  try {
    // Get total jobs count
    const totalJobs = await db.countAllJobs();

    // Get total companies (unique companies)
    const totalCompanies = await db.countDistinctCompanies();

    // Get jobs posted in the last 30 days
    const recentJobs = await db.countJobsSince(30);

    // Get category breakdown (top 10)
    const categoryStats = await db.getCategoriesWithCounts(10);

    // Get recent jobs (last 7 days)
    const jobsThisWeek = await db.countJobsSince(7);
    
    return NextResponse.json({
      success: true,
      data: {
        totalJobs,
        totalCompanies,
        recentJobs,
        jobsThisWeek,
        categoryBreakdown: categoryStats.map(cat => ({
          category: cat.category,
          count: cat.count
        }))
      }
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch statistics',
        message: error.message
      },
      { status: 500 }
    );
  }
}
