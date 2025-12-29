import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIP, sanitizeInput, logSecurityEvent } from '@/lib/authMiddleware';

// Force dynamic rendering for Webflow Cloud
export const dynamic = 'force-dynamic';

export async function POST(request) {
  // Rate limiting para prevenir spam
  const ip = getClientIP(request);
  const rateLimitResult = checkRateLimit(`submit-job:${ip}`, 3, 3600000); // 3 submissions por hora
  
  if (!rateLimitResult.allowed) {
    logSecurityEvent('JOB_SUBMIT_RATE_LIMIT_EXCEEDED', { ip });
    return NextResponse.json(
      { success: false, error: 'Too many job submissions. Please try again later.' },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
        }
      }
    );
  }
  
  try {
    const body = await request.json();

    const { jobTitle, description, company, location, role, category, jobType, email, phoneNumber, name } = body;
    
    // Sanitizar inputs para prevenir XSS
    const sanitizedJobTitle = sanitizeInput(jobTitle);
    const sanitizedDescription = sanitizeInput(description);
    const sanitizedCompany = sanitizeInput(company);
    const sanitizedLocation = sanitizeInput(location);
    const sanitizedCategory = sanitizeInput(category);
    const sanitizedJobType = sanitizeInput(jobType);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhoneNumber = sanitizeInput(phoneNumber);
    const sanitizedName = sanitizeInput(name);

    if (!sanitizedJobTitle || !sanitizedDescription) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // prefer explicit `category` sent from the form; fall back to legacy `role` then 'Other'
    const categoryValue = sanitizedCategory || role || 'Other';
    const jobDate = new Date();

    // Use a parameterized raw query to ensure `job_type` column is written even if Prisma client/schema
    // was not regenerated after adding `job_type` directly in the DB.
    const inserted = await prisma.$queryRaw`
      INSERT INTO public.jobs_sheet
        ("job_title","description","category","email_info","phone_number","job_date","company","company_verified","gender_category","job_type","status")
      VALUES
        (${sanitizedJobTitle}, ${sanitizedDescription}, ${categoryValue}, ${sanitizedEmail || null}, ${sanitizedPhoneNumber || null}, ${jobDate}, ${sanitizedCompany || null}, false, ${null}, ${sanitizedJobType || null}, 'PENDING')
      RETURNING id;
    `;

    const newId = Array.isArray(inserted) && inserted[0] ? inserted[0].id : (inserted && inserted.id);
    return NextResponse.json({ success: true, data: { id: newId } });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
