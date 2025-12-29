import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import slugify from '@/lib/slugify';
import { requireAdmin, createAuthErrorResponse } from '@/lib/authMiddleware';

export const dynamic = 'force-dynamic';

// GET /api/blogs/[slug] - Get a single blog post by slug
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, email: true }
        }
      }
    });
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // If not published, only allow admin to view
    if (!post.published) {
      const admin = await requireAdmin();
      if (!admin) {
        return NextResponse.json(
          { success: false, error: 'Blog post not found' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog', message: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[slug] - Update a blog post (admin only)
export async function PUT(request, { params }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return createAuthErrorResponse('Admin access required', 401);
    }
    
    const { slug } = await params;
    const body = await request.json();
    const { title, content, excerpt, coverImage, published } = body;
    
    const existingPost = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    // Generate new slug if title changed
    let newSlug = slug;
    if (title && title !== existingPost.title) {
      newSlug = slugify(title);
      // Check for duplicate slug
      const duplicateSlug = await prisma.blogPost.findFirst({
        where: { slug: newSlug, id: { not: existingPost.id } }
      });
      if (duplicateSlug) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
    }
    
    // Set publishedAt if publishing for first time
    let publishedAt = existingPost.publishedAt;
    if (published && !existingPost.published) {
      publishedAt = new Date();
    }
    
    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        title: title || existingPost.title,
        slug: newSlug,
        content: content || existingPost.content,
        excerpt: excerpt || existingPost.excerpt,
        coverImage: coverImage !== undefined ? coverImage : existingPost.coverImage,
        published: published !== undefined ? published : existingPost.published,
        publishedAt
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
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[slug] - Delete a blog post (admin only)
export async function DELETE(request, { params }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return createAuthErrorResponse('Admin access required', 401);
    }
    
    const { slug } = await params;
    
    const existingPost = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    await prisma.blogPost.delete({ where: { slug } });
    
    return NextResponse.json({
      success: true,
      data: { slug, message: 'Blog post deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog', message: error.message },
      { status: 500 }
    );
  }
}
