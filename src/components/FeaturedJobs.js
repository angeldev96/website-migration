import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FeaturedJobs = () => {
  const jobs = [
    {
      id: 1,
      title: 'Senior Accountant',
      company: 'Friedman & Associates',
      location: 'Boro Park, Brooklyn',
      salary: '$75,000 - $95,000',
      type: 'Full-time',
      logo: '🏢',
      tags: ['Accounting', 'Finance', 'CPA'],
      featured: true
    },
    {
      id: 2,
      title: 'Software Developer',
      company: 'Tech Solutions Inc',
      location: 'Manhattan, NY',
      salary: '$90,000 - $120,000',
      type: 'Full-time',
      logo: '💻',
      tags: ['React', 'Node.js', 'Remote'],
      featured: true
    },
    {
      id: 3,
      title: 'Hebrew Teacher',
      company: 'Yeshiva Torah Academy',
      location: 'Williamsburg, Brooklyn',
      salary: '$55,000 - $70,000',
      type: 'Full-time',
      logo: '📚',
      tags: ['Education', 'Hebrew', 'Teaching'],
      featured: false
    },
    {
      id: 4,
      title: 'Office Manager',
      company: 'Goldstein Properties',
      location: 'Lakewood, NJ',
      salary: '$50,000 - $65,000',
      type: 'Full-time',
      logo: '📋',
      tags: ['Administration', 'Management'],
      featured: false
    },
    {
      id: 5,
      title: 'Sales Representative',
      company: 'Diamond Wholesale',
      location: 'Manhattan, NY',
      salary: '$60,000 - $80,000',
      type: 'Full-time',
      logo: '💎',
      tags: ['Sales', 'B2B', 'Commission'],
      featured: true
    },
    {
      id: 6,
      title: 'Customer Service Rep',
      company: 'Kosher Market Co',
      location: 'Monsey, NY',
      salary: '$40,000 - $50,000',
      type: 'Part-time',
      logo: '🎧',
      tags: ['Customer Service', 'Retail'],
      featured: false
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Featured Jobs
          </h2>
          <p className="text-gray-600 text-lg">
            Discover your next career opportunity
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {jobs.map((job) => (
            <Link 
              href={`/jobs/${job.id}`}
              key={job.id}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-500 group relative"
            >
              {job.featured && (
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                    FEATURED
                  </span>
                </div>
              )}
              <div className="flex items-start mb-4">
                <div className="text-5xl mr-4">{job.logo}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 font-medium">{job.company}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-2">📍</span>
                  {job.location}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-2">💰</span>
                  {job.salary}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span className="mr-2">⏰</span>
                  {job.type}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link 
            href="/jobs"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
