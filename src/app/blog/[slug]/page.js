import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatFullDate } from '@/lib/dateUtils';
import { getPublishedBlogBySlug } from '@/lib/blogDb';
import { formatBlogContent } from '@/lib/formatBlogContent';

async function getBlog(slug) {
  try {
    const blog = await getPublishedBlogBySlug(slug);
    return blog;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  return {
    title: `${blog.title} | Jewish Jobs & Career Blog Brooklyn`,
    description: blog.excerpt || `${blog.title}. Find the latest insights on Jewish employment, kosher workplaces, and career opportunities in Boro Park and Brooklyn.`,
    openGraph: {
      title: `${blog.title} | Yiddish Jobs Blog`,
      description: blog.excerpt || blog.content.substring(0, 160).replace(/<[^>]*>/g, ''),
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: blog.author?.name ? [blog.author.name] : undefined,
      images: blog.coverImage ? [blog.coverImage] : undefined
    },
    keywords: `Jewish jobs Brooklyn, Boro Park employment, Yiddish blog, kosher career, frum jobs, ${blog.title.split(' ').join(', ')}`
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    notFound();
  }

  // Format the blog content for better readability
  const formattedContent = formatBlogContent(blog.content);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <main className="flex-1">
        {/* Hero / Cover Image */}
        {blog.coverImage ? (
          <div className="w-full h-64 md:h-96 relative overflow-hidden">
            <img 
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-48 md:h-64 bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900" />
        )}

        {/* Article Content */}
        <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 max-w-5xl mx-auto">
            {/* Back Link */}
            <Link 
              href="/blog"
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatFullDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg lg:prose-xl max-w-none mx-auto
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:text-base
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-blockquote:border-l-blue-600 prose-blockquote:text-gray-600
                prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-600 mb-4">Share this article</p>
              <div className="flex gap-3">
                <a 
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&title=${encodeURIComponent(blog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Spacer */}
        <div className="h-16" />
      </main>

    </div>
  );
}
