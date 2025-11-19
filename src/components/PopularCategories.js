'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiUrl } from '@/lib/apiUrl';

// Define the specific categories we want to show (normalized)
const TARGET_CATEGORIES = [
  'Other',
  'Finance',
  'Retail',
  'Sales',
  'Transportation',
  'Healthcare',
  'Restaurant',
  'Technical',
  'Technology',
  'Office',
  'Marketing',
  'Childcare',
  'Education'
];

const PopularCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl('/api/categories'));
        const data = await response.json();
        
        if (data.success) {
          // Normalize incoming category names (trim + lowercase)
          const normalizedTargets = TARGET_CATEGORIES.map(t => t.trim().toLowerCase());

          // Create a map for quick lookup by normalized name
          const catMap = new Map();
          data.data.forEach(cat => {
            const key = (cat.name || '').toString().trim().toLowerCase();
            if (!key) return;
            // prefer existing entry if present, but keep first seen
            if (!catMap.has(key)) {
              catMap.set(key, { name: (cat.name || '').toString().trim(), count: cat.count || 0, slug: cat.slug });
            }
          });

          // Build sorted array following TARGET_CATEGORIES order, using normalized matching
          const sortedCategories = normalizedTargets
            .map(targetKey => catMap.get(targetKey))
            .filter(Boolean);

          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      'Other': '💼',
      'Retail': '🛍️',
      'Sales': '📈',
      'Transportation': '🚗',
      'Healthcare': '⚕️',
      'Restaurant': '🍽️',
      'Childchildcare': '�',
      'Technical': '💻',
      'Office': '📋',
      'Childcare': '👶',
      'Education': '📚'
    };
    
    return icons[category] || '💼';
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Categories</h2>
            <p className="text-gray-600 text-lg">Browse jobs by category</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Popular Categories
          </h2>
          <p className="text-gray-600 text-lg">
            Browse jobs by category
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category) => (
            <Link 
              href={`/jobs?category=${encodeURIComponent(category.name)}`}
              key={category.name}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-500 group"
            >
              <div className="text-4xl mb-4">{getCategoryIcon(category.name)}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {category.count} open position{category.count !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
        
        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No categories available</h3>
            <p className="text-gray-600">Check back soon for job categories!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCategories;
