import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/stats - Get website statistics
export async function GET(request) {
  try {
    // Get total jobs count
    const totalJobs = await prisma.jobsSheet.count();
    
    // Get total companies (unique companies)
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentJobs = await prisma.jobsSheet.count({
      where: {
        jobDate: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // Get category breakdown
    const categoryStats = await prisma.jobsSheet.groupBy({
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
    
    // Get recent jobs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
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
        categoryBreakdown: categoryStats.map(cat => ({
          category: cat.category,
          count: cat._count.id
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
