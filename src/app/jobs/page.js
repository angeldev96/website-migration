'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Note: Since this is a client component, we'll handle SEO through dynamic head updates
// For better SEO, consider moving this to a server component in the future

const JobsPage = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const jobsPerPage = 20;

  // Dynamic page title based on category
  useEffect(() => {
    const pageTitle = selectedCategory 
      ? `${selectedCategory} Jobs in Boro Park - Jewish Employment | Yid Jobs`
      : 'Browse All Jewish Jobs in Boro Park | Yid Jobs';
    
    const pageDescription = selectedCategory
      ? `Find ${selectedCategory} jobs in the Orthodox Jewish community of Boro Park. Browse kosher ${selectedCategory} employment opportunities. Yiddish jobs available.`
      : 'Browse thousands of Jewish job opportunities in Boro Park. Find employment in the Orthodox community. Retail, healthcare, education, office and more kosher jobs available.';
    
    document.title = pageTitle;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = pageDescription;

    // Update canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    const canonicalUrl = selectedCategory 
      ? `https://yidjobs.com/jobs?category=${encodeURIComponent(selectedCategory)}`
      : 'https://yidjobs.com/jobs';
    linkCanonical.href = canonicalUrl;
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedCategory(categoryParam || '');
    setCurrentPage(1);
  }, [categoryParam]);

  useEffect(() => {
    fetchJobs(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  const fetchJobs = async (page, category) => {
    try {
      setLoading(true);
      let url = `/api/jobs?page=${page}&limit=${jobsPerPage}`;
      
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const extractLocation = (description) => {
    // Always return Boro Park as the primary location
    return 'Boro Park';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Other': '💼',
      'Retail': '🛍️',
      'Sales': '📈',
      'Transportation': '🚗',
      'Healthcare': '⚕️',
      'Restaurant': '🍽️',
      'Childchildcare': '👶',
      'Technical': '💻',
      'Office': '📋',
      'Childcare': '👶',
      'Education': '📚'
    };
    return icons[category] || '💼';
  };

  const getJobType = (description) => {
    const fullTimeKeywords = ['full-time', 'full time', 'fulltime'];
    const partTimeKeywords = ['part-time', 'part time', 'parttime'];
    const lowerDesc = description?.toLowerCase() || '';
    
    if (fullTimeKeywords.some(keyword => lowerDesc.includes(keyword))) {
      return 'Full Time';
    }
    if (partTimeKeywords.some(keyword => lowerDesc.includes(keyword))) {
      return 'Part Time';
    }
    return 'Full Time';
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setCurrentPage(1);
    window.history.pushState({}, '', '/jobs');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">All Jobs</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {selectedCategory ? `${selectedCategory} Jobs` : 'All Jobs'}
            </h1>
            <p className="text-lg text-gray-600">
              Showing {jobs.length} of {totalPages * jobsPerPage} available positions
              {selectedCategory && (
                <button
                  onClick={clearFilters}
                  className="ml-4 text-blue-600 hover:text-blue-700 font-semibold text-base"
                >
                  Clear filters ✕
                </button>
              )}
            </p>
          </div>

          {/* Active Filter Badge */}
          {selectedCategory && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                <span>{getCategoryIcon(selectedCategory)}</span>
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={clearFilters}
                  className="ml-2 text-blue-600 hover:text-blue-900"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link 
                href={`/jobs/${job.id}`}
                key={job.id}
                className="block bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    {/* Left side - Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        {/* Icon/Logo */}
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl border border-blue-200">
                            {getCategoryIcon(job.category)}
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {job.aiTitle || job.jobTitle}
                          </h3>

                          {/* Company */}
                          {job.company && (
                            <p className="text-base font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <span className="inline-flex items-center">
                                {job.company}
                                {job.companyVerified && (
                                  <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </span>
                            </p>
                          )}

                          {/* Description */}
                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                            {truncateText(job.aiDescription || job.description, 150)}
                          </p>

                          {/* Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            {/* Location */}
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{extractLocation(job.description)}</span>
                            </div>

                            {/* Job Type */}
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{getJobType(job.description)}</span>
                            </div>

                            {/* Category Badge */}
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {job.category}
                            </div>

                            {/* Gender Category if available */}
                            {job.genderCategory && job.genderCategory !== 'Any' && (
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                {job.genderCategory}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Date & Action */}
                    <div className="mt-4 md:mt-0 flex items-center md:flex-col md:items-end justify-between flex-shrink-0 ml-0 md:ml-4 gap-3 w-full md:w-auto">
                      <div className="text-sm text-gray-500 mb-0 md:mb-3">
                        {formatDate(job.jobDate)}
                      </div>
                      <button className="w-full md:w-auto px-4 py-2.5 md:px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 whitespace-nowrap text-center">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* No jobs message */}
          {jobs.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No jobs found
                {selectedCategory && ` in ${selectedCategory}`}
              </h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new opportunities!</p>
              {selectedCategory && (
                <button
                  onClick={clearFilters}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  View All Jobs
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
