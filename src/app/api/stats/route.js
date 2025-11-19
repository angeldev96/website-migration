import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

// GET /api/stats - Get website statistics
export async function GET(request) {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total jobs count
    const totalJobs = await prisma.jobsSheet.count();

    // Get total companies (unique companies)
    // Prisma doesn't have a direct countDistinct, so we use groupBy or findMany with distinct
    const uniqueCompanies = await prisma.jobsSheet.groupBy({
      by: ['company'],
      where: {
        company: {
          not: null
        }
      }
    });
    const totalCompanies = uniqueCompanies.length;

    // Get jobs posted in the last 30 days
    const recentJobs = await prisma.jobsSheet.count({
      where: {
        jobDate: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Get category breakdown (top 10)
    const categoryStatsRaw = await prisma.jobsSheet.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    });

    const categoryStats = categoryStatsRaw.map(cat => ({
      category: cat.category,
      count: cat._count.id
    }));

    // Get recent jobs (last 7 days)
    const jobsThisWeek = await prisma.jobsSheet.count({
      where: {
        jobDate: {
          gte: sevenDaysAgo
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        totalJobs,
        totalCompanies,
        recentJobs,
        jobsThisWeek,
        categoryBreakdown: categoryStats
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
