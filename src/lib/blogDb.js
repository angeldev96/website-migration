import prisma from '@/lib/prisma';

/**
 * Get published blog posts directly from database
 * This avoids HTTP fetch issues in Server Components on edge/serverless
 */
export async function getPublishedBlogs(limit = 50, page = 1) {
  try {
    const skip = (page - 1) * limit;
    
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, email: true }
        }
      }
    });

    return posts;
  } catch (error) {
    console.error('❌ Error fetching blogs from database:', error);
    return [];
  }
}

/**
 * Get a single published blog post by slug
 */
export async function getPublishedBlogBySlug(slug) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, email: true }
        }
      }
    });

    // Only return if published
    if (!post || !post.published) {
      return null;
    }

    return post;
  } catch (error) {
    console.error('❌ Error fetching blog from database:', error);
    return null;
  }
}
