import React from 'react';
import prisma from '@/lib/prisma';

// Server component: fetch counts from the database
const Stats = async () => {
  // Get real count of job listings
  let jobsCount = 0;
  try {
    jobsCount = await prisma.jobsSheet.count();
  } catch (err) {
    // If DB fails, keep a sensible fallback
    jobsCount = 0;
  }

  const stats = [
    { number: jobsCount.toLocaleString(), label: 'Jobs Listings' },
    { number: '75K', label: 'Total Job Views' },
    { number: '142', label: 'Active Employers' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
      {stats.map((stat, index) => (
        <div key={index} className="text-left">
          <div className="text-5xl md:text-6xl font-bold text-white mb-2">
            {stat.number}
          </div>
          <div className="text-lg text-gray-200">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
