import React from 'react';
import Link from 'next/link';
import { formatShortDate } from '@/lib/dateUtils';
import { getPublishedBlogs } from '@/lib/blogDb';

export const metadata = {
  title: 'Jewish Career Blog | Employment Tips for Brooklyn & Boro Park',
  description: 'Expert advice on finding Jewish jobs in Brooklyn. Read about kosher workplace culture, Yiddish employment trends, and career tips for the Orthodox community.',
  keywords: 'Jewish career blog, Brooklyn jobs news, Boro Park employment tips, Yiddish job market, kosher workplace advice, frum career insights',
};

async function getBlogs() {
  try {
    const blogs = await getPublishedBlogs(50);
    return blogs;
  } catch (error) {
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 py-8 md:py-12">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Our Blog
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Tips, insights, and news to help you succeed
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
            {blogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No blog posts yet</h2>
                <p className="text-gray-600">Check back soon for new content!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <article 
                    key={blog.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    {/* Cover Image */}
                    {blog.coverImage ? (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span>{formatShortDate(blog.publishedAt || blog.createdAt)}</span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${blog.slug}`}>
                          {blog.title}
                        </Link>
                      </h2>

                      <p className="text-gray-600 line-clamp-3 mb-4 flex-1">
                        {blog.excerpt || blog.content.substring(0, 150) + '...'}
                      </p>

                      <Link 
                        href={`/blog/${blog.slug}`}
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                      >
                        Read More
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

    </div>
  );
}
