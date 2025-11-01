import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/jobs/[id] - Get a single job by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);
    
    if (isNaN(jobId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid job ID'
        },
        { status: 400 }
      );
    }
    
    const job = await prisma.jobsSheet.findUnique({
      where: {
        id: jobId
      }
    });
    
    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: job
    });
    
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch job',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete a job by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const jobId = parseInt(id);

    if (isNaN(jobId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid job ID'
        },
        { status: 400 }
      );
    }

    // Attempt to delete the job
    const deleted = await prisma.jobsSheet.delete({
      where: { id: jobId }
    });

    return NextResponse.json({
      success: true,
      data: { id: deleted.id }
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    // If record not found, prisma throws an error - return 404
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete job', message: error.message },
      { status: 500 }
    );
  }
}
