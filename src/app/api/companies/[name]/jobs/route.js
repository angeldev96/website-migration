import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enrichJobsWithLogos } from '@/lib/companyLogo';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { name } = await params;
  
  console.log('Company API called with name:', name);
  
  if (!name) {
    return NextResponse.json(
      { error: 'Company name is required' },
      { status: 400 }
    );
  }

  try {
    const decodedName = decodeURIComponent(name);
    console.log('Decoded company name:', decodedName);

    // Get company info
    const company = await prisma.company.findUnique({
      where: { name: decodedName },
      select: {
        id: true,
        name: true,
        logoUrl: true
      }
    });

    console.log('Company found:', company);

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Get all jobs for this company
    const jobs = await prisma.jobsSheet.findMany({
      where: {
        company: decodedName
      },
      orderBy: {
        jobDate: 'desc'
      },
      select: {
        id: true,
        jobTitle: true,
        aiTitle: true,
        description: true,
        aiDescription: true,
        category: true,
        company: true,
        jobType: true,
        jobDate: true,
        emailInfo: true,
        phoneNumber: true,
        companyVerified: true
      }
    });

    // Enrich with logos (will use cached company data)
    const jobsWithLogos = await enrichJobsWithLogos(jobs);

    return NextResponse.json({
      company,
      jobs: jobsWithLogos,
      totalJobs: jobsWithLogos.length
    });

  } catch (error) {
    console.error('Error fetching company jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company jobs' },
      { status: 500 }
    );
  }
}
