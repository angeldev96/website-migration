import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force Node.js runtime (required for Prisma)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();

  const { jobTitle, description, company, location, role, category, jobType, email, phoneNumber, name } = body;

    if (!jobTitle || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // prefer explicit `category` sent from the form; fall back to legacy `role` then 'Other'
    const categoryValue = category || role || 'Other';
    const jobDate = new Date();

    // Use a parameterized raw query to ensure `job_type` column is written even if Prisma client/schema
    // was not regenerated after adding the column directly in the DB.
    const inserted = await prisma.$queryRaw`
      INSERT INTO public.jobs_sheet
        ("job_title","description","category","email_info","phone_number","job_date","company","company_verified","gender_category","job_type")
      VALUES
        (${jobTitle}, ${description}, ${categoryValue}, ${email || null}, ${phoneNumber || null}, ${jobDate}, ${company || null}, false, ${null}, ${jobType || null})
      RETURNING id;
    `;

    const newId = Array.isArray(inserted) && inserted[0] ? inserted[0].id : (inserted && inserted.id);
    return NextResponse.json({ success: true, data: { id: newId } });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
