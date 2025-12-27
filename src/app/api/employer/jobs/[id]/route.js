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

// PUT /api/employer/jobs/[id] - Update job (only owner)
export async function PUT(request, { params }) {
  try {
    const user = await verifyCorporation(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const jobId = parseInt(id);
    if (isNaN(jobId)) {
      return NextResponse.json({ success: false, error: 'Invalid job ID' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.$queryRaw`
      SELECT id, publisher_id FROM jobs_sheet WHERE id = ${jobId}
    `;

    if (!existing || existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    if (existing[0].publisher_id !== user.userId) {
      return NextResponse.json({ success: false, error: 'Not authorized to edit this job' }, { status: 403 });
    }

    const { jobTitle, description, company, category, jobType, email, phoneNumber } = await request.json();

    await prisma.$executeRaw`
      UPDATE jobs_sheet SET
        job_title = ${jobTitle || existing[0].job_title},
        description = ${description || existing[0].description},
        company = ${company || null},
        category = ${category || 'Other'},
        job_type = ${jobType || null},
        email_info = ${email || null},
        phone_number = ${phoneNumber || null}
      WHERE id = ${jobId}
    `;

    console.log(`[AUDIT] Corporation user ${user.userId} updated job ${jobId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating employer job:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/employer/jobs/[id] - Delete job (only owner)
export async function DELETE(request, { params }) {
  try {
    const user = await verifyCorporation(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const jobId = parseInt(id);
    if (isNaN(jobId)) {
      return NextResponse.json({ success: false, error: 'Invalid job ID' }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.$queryRaw`
      SELECT id, publisher_id FROM jobs_sheet WHERE id = ${jobId}
    `;

    if (!existing || existing.length === 0) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    if (existing[0].publisher_id !== user.userId) {
      return NextResponse.json({ success: false, error: 'Not authorized to delete this job' }, { status: 403 });
    }

    await prisma.$executeRaw`DELETE FROM jobs_sheet WHERE id = ${jobId}`;

    console.log(`[AUDIT] Corporation user ${user.userId} deleted job ${jobId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting employer job:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
