import React from 'react';
import Link from 'next/link';
import { getCachedFeaturedJobs } from '@/lib/cache';
import { formatRelativeDate } from '@/lib/dateUtils';

// Server Component - No client JS!
const FeaturedJobsServer = async ({ page = 1, limit = 15 }) => {
  const { jobs, total, totalPages } = await getCachedFeaturedJobs(limit, page);

  const getCategoryIcon = (category) => {
    const icons = {
      'Accounting': '📊', 'Technology': '💻', 'Education': '📚',
      'Healthcare': '⚕️', 'Sales': '📈', 'Marketing': '📈',
      'Administration': '📋', 'Customer Service': '🎧', 'Finance': '💰',
      'IT': '💻', 'Childcare': '👶', 'Food': '🍽️', 'Retail': '🛍️',
      'Construction': '🏗️', 'Transportation': '🚗', 'Legal': '⚖️',
      'Real Estate': '🏠', 'Human Resources': '👥', 'Design': '🎨',
      'Writing': '✍️', 'Restaurant': '🍽️', 'Office': '📋', 'Other': '💼'
    };
    for (const [key, icon] of Object.entries(icons)) {
      if (category?.toLowerCase().includes(key.toLowerCase())) return icon;
    }
    return '💼';
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Job Listings</h2>
          <p className="text-gray-600 text-lg">
            Discover {total.toLocaleString()}+ opportunities in Boro Park
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
              prefetch={false}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl border border-blue-200">
                          {getCategoryIcon(job.category)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {job.aiTitle || job.jobTitle}
                        </h3>
                        {job.company && (
                          <p className="text-base font-medium text-gray-700 mb-3">{job.company}</p>
                        )}
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                          {truncateText(job.aiDescription || job.description, 150)}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Boro Park</span>
                          </div>
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {job.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center md:flex-col md:items-end justify-between shrink-0 ml-0 md:ml-4 gap-3 w-full md:w-auto">
                    <div className="text-sm text-gray-500 mb-0 md:mb-3">
                      {formatRelativeDate(job.jobDate)}
                    </div>
                    <span className="w-full md:w-auto px-4 py-2.5 md:px-6 bg-blue-600 text-white rounded-lg font-semibold group-hover:bg-blue-700 transition-all duration-300 shadow-sm text-center">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12 gap-4">
          {page > 1 && (
            <Link
              href={`/?page=${page - 1}`}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Previous
            </Link>
          )}
          <Link
            href="/jobs"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            View All Jobs
          </Link>
          {page < totalPages && (
            <Link
              href={`/?page=${page + 1}`}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobsServer;
