import React from 'react';
import Link from 'next/link';

const PopularCategories = () => {
  const categories = [
    { name: 'Accounting & Finance', count: 45, icon: '📊' },
    { name: 'Technology & IT', count: 89, icon: '💻' },
    { name: 'Education & Training', count: 67, icon: '📚' },
    { name: 'Healthcare', count: 52, icon: '⚕️' },
    { name: 'Sales & Marketing', count: 73, icon: '📈' },
    { name: 'Customer Service', count: 38, icon: '🎧' },
    { name: 'Administration', count: 56, icon: '📋' },
    { name: 'Food Services', count: 42, icon: '🍽️' }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Popular Categories
          </h2>
          <p className="text-gray-600 text-lg">
            Browse jobs by category
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <Link 
              href={`/categories/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-500 group"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {category.count} open positions
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
