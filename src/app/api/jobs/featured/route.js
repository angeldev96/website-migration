import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enrichJobsWithLogos } from '@/lib/companyLogo';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

// GET /api/jobs/featured - Get featured/recent jobs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    
    // Get most recent jobs (newest first by ID)
    const jobs = await prisma.jobsSheet.findMany({
      take: limit,
      orderBy: {
        id: 'desc'
      },
      where: {
        // Optional: only show jobs with basic info
        jobTitle: {
          not: null
        }
      },
      select: {
        id: true,
        jobTitle: true,
        description: true,
        category: true,
        company: true,
        emailInfo: true,
        phoneNumber: true,
        jobDate: true,
        genderCategory: true,
        companyVerified: true,
        aiTitle: true,
        aiDescription: true
      }
    });
    
    // Enrich jobs with company logos
    const jobsWithLogos = await enrichJobsWithLogos(jobs);
    
    return NextResponse.json({
      success: true,
      data: jobsWithLogos,
      count: jobsWithLogos.length
    });
    
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured jobs',
        message: error.message
      },
      { status: 500 }
    );
  }
}
