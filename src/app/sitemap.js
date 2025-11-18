import db from '@/lib/db';

export default async function sitemap() {
  const baseUrl = 'https://yidjobs.com';
  
  // Static pages
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
      url: `${baseUrl}/post-job`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    // Fetch all jobs for dynamic URLs
    const jobs = await db.getJobsForSitemap();

    const jobPages = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
  lastModified: job.jobDate || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // Fetch unique categories for category pages
    const categories = await db.getDistinctCategories();

    const categoryPages = categories
      .filter(cat => cat.category)
      .map((cat) => ({
        url: `${baseUrl}/jobs?category=${encodeURIComponent(cat.category)}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      }));

    return [...staticPages, ...categoryPages, ...jobPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return only static pages if there's an error
    return staticPages;
  }
}
