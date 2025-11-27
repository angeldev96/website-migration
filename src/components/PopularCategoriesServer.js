import React from 'react';
import Link from 'next/link';
import { getCachedCategories } from '@/lib/cache';

// Pure Server Component - no client JS
const PopularCategoriesServer = async () => {
  const categories = await getCachedCategories();

  const categoryIcons = {
    'Retail': '🛍️',
    'Sales': '📈',
    'Healthcare': '⚕️',
    'Education': '📚',
    'Restaurant': '🍽️',
    'Childcare': '👶',
    'Office': '📋',
    'Technical': '💻',
    'Transportation': '🚗',
    'Other': '💼',
    'Accounting': '📊',
    'Finance': '💰',
    'Legal': '⚖️',
    'Real Estate': '🏠',
    'Construction': '🏗️',
    'Design': '🎨',
    'Marketing': '📈',
  };

  const getIcon = (categoryName) => {
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (categoryName?.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return '💼';
  };

  // Take top 8 categories
  const topCategories = categories.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-600 text-lg">
            Find jobs in your preferred field
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {topCategories.map((category) => (
            <Link
              key={category.name}
              href={`/jobs?category=${encodeURIComponent(category.name)}`}
              className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 group"
              prefetch={false}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {getIcon(category.name)}
              </div>
              <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {category.count} {category.count === 1 ? 'job' : 'jobs'}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            View All Categories
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCategoriesServer;
