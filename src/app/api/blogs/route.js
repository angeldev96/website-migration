import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from '@/lib/slugify';
import generateSlugWithLLM from '@/lib/llm';
import { requireAdmin, createAuthErrorResponse } from '@/lib/authMiddleware';

export const dynamic = 'force-dynamic';

// GET /api/blogs - Get all blog posts (public: only published, admin: all)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const includeUnpublished = searchParams.get('all') === 'true';
    
    // Check if admin for unpublished posts
    const admin = includeUnpublished ? await requireAdmin() : null;
    
    const where = admin ? {} : { published: true };
    
    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, email: true }
          }
        }
      })
    ]);
    
    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog post (admin only)
export async function POST(request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return createAuthErrorResponse('Admin access required', 401);
    }
    
    const body = await request.json();
    const { title, content, excerpt, coverImage, published } = body;
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Try to generate slug with LLM (Gemini). Fallback to slugify.
    // Generate slug (LLM or fallback). Avoid logging title or generated slug in production.
    let slug = null;
    try {
      slug = await generateSlugWithLLM(title);
    } catch (e) {
      // LLM generation failed — fallback will be used. Do not log error details here.
      slug = null;
    }
    
    if (!slug) {
      slug = slugify(title);
    }

    // Ensure uniqueness
    const existingSlug = await prisma.blogPost.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }
    
    
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 200).replace(/<[^>]*>/g, '') + '...',
        coverImage,
        authorId: admin.id,
        published: published || false,
        publishedAt: published ? new Date() : null
      },
      include: {
        author: {
          select: { id: true, email: true }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: post
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog', message: error.message },
      { status: 500 }
    );
  }
}
