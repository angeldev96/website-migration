'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/apiUrl';
import { formatRelativeDate } from '@/lib/dateUtils';
import { formatGenderCategory } from '@/lib/jobUtils';
import {
  BarChart3,
  Monitor,
  GraduationCap,
  HeartPulse,
  TrendingUp,
  Megaphone,
  ClipboardList,
  Headphones,
  BadgeDollarSign,
  Cpu,
  Baby,
  UtensilsCrossed,
  ShoppingBag,
  HardHat,
  Car,
  Gavel,
  Home,
  Users,
  Paintbrush,
  PenLine,
  Briefcase,
  Search
} from 'lucide-react';

const FeaturedJobs = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 15;

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const fetchJobs = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(apiUrl(`/api/jobs?page=${page}&limit=${jobsPerPage}`));
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  const extractLocation = (description) => {
    // Always return Boro Park as the primary location
    return 'Boro Park';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Accounting: BarChart3,
      Technology: Monitor,
      Education: GraduationCap,
      Healthcare: HeartPulse,
      Sales: TrendingUp,
      Marketing: Megaphone,
      Administration: ClipboardList,
      'Customer Service': Headphones,
      Finance: BadgeDollarSign,
      IT: Cpu,
      Childcare: Baby,
      Food: UtensilsCrossed,
      Retail: ShoppingBag,
      Construction: HardHat,
      Transportation: Car,
      Legal: Gavel,
      'Real Estate': Home,
      'Human Resources': Users,
      Design: Paintbrush,
      Writing: PenLine
    };

    for (const [key, Icon] of Object.entries(icons)) {
      if (category?.toLowerCase().includes(key.toLowerCase())) {
        return Icon;
      }
    }
    return Briefcase;
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

  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Job Listings</h2>
            <p className="text-gray-600 text-lg">Loading opportunities...</p>
          </div>
          <div className="grid grid-cols-1 gap-4 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Jobs</h2>
            <p className="text-gray-600">
              Showing {jobs.length} of {totalPages * jobsPerPage} available positions
            </p>
          </div>
          <Link 
            href="/jobs"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors"
          >
            Browse All Jobs
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Jobs List */}
        <div className="max-w-6xl mx-auto space-y-4">
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
                      <div className="shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl border border-blue-200 shadow-sm">
                          {(() => {
                            const Icon = getCategoryIcon(job.category);
                            return <Icon className="w-9 h-9 text-blue-700" aria-hidden="true" />;
                          })()}
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
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(`/companies/${encodeURIComponent(job.company)}`);
                            }}
                            className="flex items-center gap-2 mb-3 hover:opacity-75 transition-opacity w-fit cursor-pointer"
                          >
                            {job.companyLogo && (
                              <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center p-1.5 shrink-0">
                                <img 
                                  src={job.companyLogo} 
                                  alt={`${job.company} logo`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <p className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                              {job.company}
                              {job.companyVerified && (
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </p>
                          </div>
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

                          {/* Job Type Badge if available */}
                          {job.genderCategory && job.genderCategory !== 'Any' && (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                              {formatGenderCategory(job.genderCategory)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Date & Action */}
                  <div className="mt-4 md:mt-0 flex items-center md:flex-col md:items-end justify-between shrink-0 ml-0 md:ml-4 gap-3 w-full md:w-auto">
                    <div className="text-sm text-gray-500 mb-0 md:mb-3">
                      {formatRelativeDate(job.jobDate)}
                    </div>
                    <button className="w-full md:w-auto px-4 py-2.5 md:px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95">
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
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center text-gray-500">
              <Search className="w-14 h-14" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No jobs found</h3>
            <p className="text-gray-600">Check back soon for new opportunities!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedJobs;
