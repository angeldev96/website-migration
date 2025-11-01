import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();

  const { jobTitle, description, company, location, role, category, jobType, email, phoneNumber, name } = body;

    if (!jobTitle || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newJob = await prisma.jobsSheet.create({
      data: {
        jobTitle,
        description,
  // prefer explicit `category` sent from the form; fall back to legacy `role` then 'Other'
  category: category || role || 'Other',
        company: company || null,
        emailInfo: email || null,
        phoneNumber: phoneNumber || null,
        jobDate: new Date(),
        genderCategory: null,
        companyVerified: false,
      }
    });

    return NextResponse.json({ success: true, data: { id: newJob.id } });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
