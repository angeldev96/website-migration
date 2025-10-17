import React from 'react';
import SearchBar from '@/components/SearchBar';
import Stats from '@/components/Stats';
import PopularCategories from '@/components/PopularCategories';
import FeaturedJobs from '@/components/FeaturedJobs';

const HomePage = () => {
  return (
    <>
      {/* Hero Section with Background */}
      <div className="relative min-h-[600px] bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 text-white overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            <path d="M100 20 L180 180 L20 180 Z" stroke="white" strokeWidth="3" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
            <circle cx="75" cy="75" r="70" stroke="white" strokeWidth="3" />
          </svg>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-transparent"></div>
        
        <section className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Yiddish Jobs - The largest Jewish Jobs website
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Find your dream job among thousands of available positions within the Jewish community in Boro Park, Brooklyn.
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Stats Section */}
          <Stats />
        </section>
      </div>

      {/* Popular Categories Section */}
      <PopularCategories />

      {/* Featured Jobs Section */}
      <FeaturedJobs />

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals in the Jewish community finding meaningful careers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/jobs" 
              className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg inline-block"
            >
              Browse All Jobs
            </a>
            <a 
              href="/post-ad" 
              className="bg-blue-800 text-white px-8 py-3 rounded-md hover:bg-blue-900 transition-colors font-semibold text-lg shadow-lg inline-block"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
