"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/apiUrl';
import { formatRelativeDate } from '@/lib/dateUtils';
import {
  Briefcase,
  ShoppingBag,
  TrendingUp,
  Car,
  HeartPulse,
  UtensilsCrossed,
  Baby,
  ClipboardList,
  GraduationCap,
  BadgeDollarSign,
  Cpu,
  Monitor,
  Megaphone,
  Search
} from 'lucide-react';

const JobsClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
  const jobsPerPage = 20;

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
      if (category) url += `&category=${encodeURIComponent(category)}`;
      const response = await fetch(apiUrl(url));
      const data = await response.json();
      if (data.success) {
        setJobs(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } finally {
      setLoading(false);
    }
  };

  const extractLocation = () => 'Boro Park';

  const getCategoryIcon = (category) => {
    const icons = {
      Other: Briefcase,
      Finance: BadgeDollarSign,
      Retail: ShoppingBag,
      Sales: TrendingUp,
      Transportation: Car,
      Healthcare: HeartPulse,
      Restaurant: UtensilsCrossed,
      Technical: Cpu,
      Technology: Monitor,
      Office: ClipboardList,
      Marketing: Megaphone,
      Childcare: Baby,
      Education: GraduationCap
    };

    return icons[category] || Briefcase;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setCurrentPage(1);
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/jobs');
  };

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
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{selectedCategory ? `${selectedCategory} Jobs` : 'All Jobs'}</h1>
            <p className="text-lg text-gray-600">Showing {jobs.length} of {totalPages * jobsPerPage} available positions</p>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div className="w-14 h-14 rounded-lg bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl border border-blue-200">
                            {(() => {
                              const Icon = getCategoryIcon(job.category);
                              return <Icon className="w-8 h-8 text-blue-700" aria-hidden="true" />;
                            })()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{job.aiTitle || job.jobTitle}</h3>
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
                                <div className="w-8 h-8 rounded bg-gray-50 border border-gray-200 flex items-center justify-center p-1 shrink-0">
                                  <img 
                                    src={job.companyLogo} 
                                    alt={`${job.company} logo`}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              )}
                              <p className="text-base font-medium text-gray-700 hover:text-blue-600 transition-colors">{job.company}</p>
                            </div>
                          )}
                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">{truncateText(job.aiDescription || job.description, 150)}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span>{extractLocation(job.description)}</span></div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{job.category}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center md:flex-col md:items-end justify-between shrink-0 ml-0 md:ml-4 gap-3 w-full md:w-auto">
                      <div className="text-sm text-gray-500 mb-0 md:mb-3">{formatRelativeDate(job.jobDate)}</div>
                      <button className="w-full md:w-auto px-4 py-2.5 md:px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 whitespace-nowrap text-center">View Details</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {jobs.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="mb-4 flex justify-center text-gray-500">
                <Search className="w-14 h-14" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new opportunities!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsClient;
