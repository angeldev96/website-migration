import { unstable_cache } from 'next/cache';
import prisma from './prisma';

/**
 * Cache configuration for different data types
 * Using Next.js 15 unstable_cache for server-side caching
 */

// Cache tags for granular invalidation
export const CACHE_TAGS = {
  JOBS: 'jobs',
  JOBS_LIST: 'jobs-list',
  JOB_DETAIL: 'job-detail',
  CATEGORIES: 'categories',
  STATS: 'stats',
  BLOGS: 'blogs',
  FEATURED: 'featured-jobs',
};

// Cache durations in seconds
export const CACHE_TIMES = {
  JOBS_LIST: 60,        // 1 minute - jobs list updates frequently
  JOB_DETAIL: 300,      // 5 minutes - individual job details
  CATEGORIES: 3600,     // 1 hour - categories rarely change
  STATS: 300,           // 5 minutes - stats
  BLOGS: 120,           // 2 minutes - blog posts
  FEATURED: 60,         // 1 minute - featured jobs
  SITEMAP: 3600,        // 1 hour - sitemap
};

/**
 * Get featured/recent jobs with caching
 */
export const getCachedFeaturedJobs = unstable_cache(
  async (limit = 15, page = 1) => {
    const skip = (page - 1) * limit;
    
    const [total, jobs] = await Promise.all([
      prisma.jobsSheet.count(),
      prisma.jobsSheet.findMany({
        take: limit,
        skip,
        orderBy: { id: 'desc' },
        select: {
          id: true,
          jobTitle: true,
          aiTitle: true,
          company: true,
          category: true,
          description: true,
          aiDescription: true,
          jobDate: true,
          genderCategory: true,
        },
      }),
    ]);

    return {
      jobs,
      total,
      totalPages: Math.ceil(total / limit),
    };
  },
  ['featured-jobs'],
  {
    revalidate: CACHE_TIMES.FEATURED,
    tags: [CACHE_TAGS.FEATURED, CACHE_TAGS.JOBS_LIST],
  }
);

/**
 * Get job by ID with caching
 */
export const getCachedJob = unstable_cache(
  async (id) => {
    const job = await prisma.jobsSheet.findUnique({
      where: { id: parseInt(id) },
    });
    return job;
  },
  ['job-detail'],
  {
    revalidate: CACHE_TIMES.JOB_DETAIL,
    tags: [CACHE_TAGS.JOB_DETAIL],
  }
);

/**
 * Get all unique categories with caching
 */
export const getCachedCategories = unstable_cache(
  async () => {
    const categories = await prisma.jobsSheet.findMany({
      distinct: ['category'],
      select: { category: true },
      where: {
        category: { not: null },
      },
    });
    
    // Count jobs per category
    const categoryCounts = await prisma.jobsSheet.groupBy({
      by: ['category'],
      _count: { category: true },
      where: {
        category: { not: null },
      },
    });

    const countMap = Object.fromEntries(
      categoryCounts.map((c) => [c.category, c._count.category])
    );

    return categories
      .filter((c) => c.category)
      .map((c) => ({
        name: c.category,
        count: countMap[c.category] || 0,
      }))
      .sort((a, b) => b.count - a.count);
  },
  ['categories'],
  {
    revalidate: CACHE_TIMES.CATEGORIES,
    tags: [CACHE_TAGS.CATEGORIES],
  }
);

/**
 * Get site stats with caching
 */
export const getCachedStats = unstable_cache(
  async () => {
    const [totalJobs, categoriesCount] = await Promise.all([
      prisma.jobsSheet.count(),
      prisma.jobsSheet.findMany({
        distinct: ['category'],
        select: { category: true },
      }),
    ]);

    return {
      totalJobs,
      totalCategories: categoriesCount.filter((c) => c.category).length,
      // Approximate active companies (unique companies from recent jobs)
      activeCompanies: Math.floor(totalJobs * 0.4), // Estimate
    };
  },
  ['stats'],
  {
    revalidate: CACHE_TIMES.STATS,
    tags: [CACHE_TAGS.STATS],
  }
);

/**
 * Get jobs for sitemap with long cache
 */
export const getCachedSitemapJobs = unstable_cache(
  async () => {
    const jobs = await prisma.jobsSheet.findMany({
      select: {
        id: true,
        jobDate: true,
      },
      orderBy: { jobDate: 'desc' },
    });
    return jobs;
  },
  ['sitemap-jobs'],
  {
    revalidate: CACHE_TIMES.SITEMAP,
    tags: [CACHE_TAGS.JOBS],
  }
);

/**
 * Get published blogs with caching
 */
export const getCachedBlogs = unstable_cache(
  async (limit = 50, includeUnpublished = false) => {
    const where = includeUnpublished ? {} : { published: true };
    
    const blogs = await prisma.blogPost.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
    return blogs;
  },
  ['blogs'],
  {
    revalidate: CACHE_TIMES.BLOGS,
    tags: [CACHE_TAGS.BLOGS],
  }
);
