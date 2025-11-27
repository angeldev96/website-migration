import React from 'react';
import { getCachedStats } from '@/lib/cache';

// Pure Server Component - no client JS
const StatsServer = async () => {
  const stats = await getCachedStats();

  const statItems = [
    {
      number: stats.totalJobs.toLocaleString() + '+',
      label: 'Jobs Available',
      icon: '💼',
    },
    {
      number: stats.activeCompanies.toLocaleString() + '+',
      label: 'Active Employers',
      icon: '🏢',
    },
    {
      number: stats.totalCategories.toString(),
      label: 'Job Categories',
      icon: '📋',
    },
  ];

  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {statItems.map((stat, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              {stat.number}
            </div>
            <div className="text-gray-200 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsServer;
