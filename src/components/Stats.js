import React from 'react';

const Stats = () => {
  const stats = [
    { number: '473', label: 'Jobs Listings' },
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
