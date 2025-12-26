import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { enrichJobsWithLogos } from '@/lib/companyLogo';

async function getCompanyJobs(companyName) {
  try {
    // Get company info
    const company = await prisma.company.findUnique({
      where: { name: companyName },
      select: {
        id: true,
        name: true,
        logoUrl: true
      }
    });

    if (!company) {
      return null;
    }

    // Get all jobs for this company by matching company name
    const jobs = await prisma.jobsSheet.findMany({
      where: {
        company: companyName
      },
      orderBy: {
        jobDate: 'desc'
      },
      select: {
        id: true,
        jobTitle: true,
        aiTitle: true,
        description: true,
        aiDescription: true,
        category: true,
        company: true,
        jobType: true,
        jobDate: true,
        emailInfo: true,
        phoneNumber: true,
        companyVerified: true
      }
    });

    // Enrich with logos
    const jobsWithLogos = await enrichJobsWithLogos(jobs);

    return {
      company,
      jobs: jobsWithLogos,
      totalJobs: jobsWithLogos.length
    };
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  
  return {
    title: `${decodedName} Jobs - Yiddish Jobs`,
    description: `Browse all job opportunities at ${decodedName}. Find your next career in the Orthodox Jewish community of Boro Park.`
  };
}

export default async function CompanyPage({ params }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  
  const data = await getCompanyJobs(decodedName);
  
  if (!data) {
    notFound();
  }

  const { company, jobs, totalJobs } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-screen-2xl">
          <div className="flex items-center gap-6">
            {company.logoUrl && (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-white shadow-md p-3 flex-shrink-0">
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {company.name}
              </h1>
              <p className="text-lg text-gray-600">
                {totalJobs} {totalJobs === 1 ? 'Job Opening' : 'Job Openings'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No job openings available at the moment.</p>
            <Link
              href="/jobs"
              className="inline-block mt-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse All Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => {
              const displayTitle = job.aiTitle || job.jobTitle;
              const displayDescription = job.aiDescription || job.description;
              const truncatedDescription = displayDescription?.length > 150
                ? displayDescription.substring(0, 150) + '...'
                : displayDescription;

              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
                >
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {displayTitle}
                      </h2>
                      
                      {/* Company Info */}
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        {job.companyLogo && (
                          <div className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center flex-shrink-0 p-1">
                            <img
                              src={job.companyLogo}
                              alt={`${job.company} logo`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-4">
                    {job.category && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.category}
                        </span>
                        {job.jobType && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {job.jobType}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-gray-600 text-sm line-clamp-3">
                      {truncatedDescription}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {job.jobDate && (
                      <span className="text-xs text-gray-500">
                        Posted {new Date(job.jobDate).toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-blue-600 font-medium text-sm hover:text-blue-700">
                      View Details →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Back to All Jobs */}
        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Back to All Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
