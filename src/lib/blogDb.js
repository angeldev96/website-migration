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
      orderBy: { createdAt: 'desc' }
    });

    // DEBUG: Log para verificar cuántos posts devuelve
    console.log('[getPublishedBlogs] limit:', limit, 'page:', page, 'skip:', skip, 'returned:', posts.length);

    return posts;
  } catch (error) {
    console.error('[getPublishedBlogs] Error:', error);
    return [];
  }
}

/**
 * Get a single published blog post by slug
 */
export async function getPublishedBlogBySlug(slug) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });

    // Only return if published
    if (!post || !post.published) {
      return null;
    }

    return post;
  } catch (error) {
    return null;
  }
}
