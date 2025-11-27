import prisma from '@/lib/prisma';

// Cache sitemap for 1 hour
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = 'https://yidjobs.com';
  
  // Static pages with SEO priorities
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/post-job`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Fetch all jobs for dynamic URLs
    const jobs = await prisma.jobsSheet.findMany({
      select: {
        id: true,
        jobDate: true
      },
      orderBy: {
        jobDate: 'desc'
      }
    });

    const jobPages = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
  lastModified: job.jobDate || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Fetch unique categories for category pages
    const categories = await prisma.jobsSheet.findMany({
      distinct: ['category'],
      select: {
        category: true
      }
    });

    const categoryPages = categories
      .filter(cat => cat.category)
      .map((cat) => ({
        url: `${baseUrl}/jobs?category=${encodeURIComponent(cat.category)}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      }));

    // Fetch published blog posts
    let blogPages = [];
    try {
      const blogs = await prisma.blogPost.findMany({
        where: { published: true },
        select: {
          slug: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      blogPages = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    } catch (e) {
      // Blog table might not exist yet
      console.log('Blog sitemap skipped:', e.message);
    }

    return [...staticPages, ...categoryPages, ...jobPages, ...blogPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return only static pages if there's an error
    return staticPages;
  }
}
