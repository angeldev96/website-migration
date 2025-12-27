import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

function parseCookie(cookieHeader) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map(p => p.trim());
  for (const part of parts) {
    if (part.startsWith('token=')) return part.replace('token=', '');
  }
  return null;
}

async function verifyCorporation(request) {
  const cookie = request.headers.get('cookie');
  const token = parseCookie(cookie);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'CORPORATION') return null;
    return decoded;
  } catch {
    return null;
  }
}

// GET /api/employer/jobs - List jobs posted by current corporation
export async function GET(request) {
  try {
    const user = await verifyCorporation(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get jobs posted by this user
    const jobs = await prisma.$queryRaw`
      SELECT id, job_title as "jobTitle", ai_title as "aiTitle", description, ai_description as "aiDescription",
             category, company, email_info as "emailInfo", phone_number as "phoneNumber", 
             job_date as "jobDate", job_type as "jobType", status, publisher_id as "publisherId"
      FROM jobs_sheet 
      WHERE publisher_id = ${user.userId}
      ORDER BY id DESC
    `;

    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/employer/jobs - Create new job (auto-approved for corporations)
export async function POST(request) {
  try {
    const user = await verifyCorporation(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { jobTitle, description, company, category, jobType, email, phoneNumber } = await request.json();

    if (!jobTitle || !description) {
      return NextResponse.json({ success: false, error: 'Job title and description required' }, { status: 400 });
    }

    const categoryValue = category || 'Other';
    const jobDate = new Date();

    // Corporation jobs are auto-approved (no PENDING status)
    const inserted = await prisma.$queryRaw`
      INSERT INTO public.jobs_sheet
        ("job_title", "description", "category", "email_info", "phone_number", "job_date", "company", "company_verified", "job_type", "status", "publisher_id")
      VALUES
        (${jobTitle}, ${description}, ${categoryValue}, ${email || null}, ${phoneNumber || null}, ${jobDate}, ${company || null}, true, ${jobType || null}, 'APPROVED', ${user.userId})
      RETURNING id;
    `;

    const newId = Array.isArray(inserted) && inserted[0] ? inserted[0].id : (inserted && inserted.id);

    console.log(`[AUDIT] Corporation user ${user.userId} created job ${newId} (auto-approved)`);

    return NextResponse.json({ success: true, data: { id: newId } });
  } catch (error) {
    console.error('Error creating employer job:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
