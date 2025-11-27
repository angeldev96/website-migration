'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [candidatesOpen, setCandidatesOpen] = useState(false);
  const [employersOpen, setEmployersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
  <div className="flex justify-center md:justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image 
                src="https://cdn.prod.website-files.com/67f2f66843f44cc07e764676/68b9a60095ee55fe840f7e34_New%20Yiddish%20Jobs%20Logo.png" 
                alt="Yiddish Jobs Logo" 
                width={300} 
                height={100}
                priority
                className="h-24 md:h-28 w-auto brightness-0"
                style={{ filter: 'brightness(0) saturate(100%)' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Locations Dropdown */}
            <div className="relative group">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                onMouseEnter={() => setLocationsOpen(true)}
                onMouseLeave={() => setLocationsOpen(false)}
              >
                Locations
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {locationsOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2"
                  onMouseEnter={() => setLocationsOpen(true)}
                  onMouseLeave={() => setLocationsOpen(false)}
                >
                  <Link href="/locations/boro-park" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Boro Park</Link>
                  <Link href="/locations" className="block px-4 py-2 text-blue-600 font-medium hover:bg-blue-50">View All →</Link>
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                Categories
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {categoriesOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <Link href="/categories/accounting" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Accounting & Finance</Link>
                  <Link href="/categories/technology" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Technology & IT</Link>
                  <Link href="/categories/education" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Education</Link>
                  <Link href="/categories/healthcare" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Healthcare</Link>
                  <Link href="/categories/sales" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Sales & Marketing</Link>
                  <Link href="/categories" className="block px-4 py-2 text-blue-600 font-medium hover:bg-blue-50">View All →</Link>
                </div>
              )}
            </div>

            {/* For Candidates Dropdown */}
            <div className="relative group">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                onMouseEnter={() => setCandidatesOpen(true)}
                onMouseLeave={() => setCandidatesOpen(false)}
              >
                For Candidates
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {candidatesOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2"
                  onMouseEnter={() => setCandidatesOpen(true)}
                  onMouseLeave={() => setCandidatesOpen(false)}
                >
                  <Link href="/candidates/browse-jobs" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Browse Jobs</Link>
                  <Link href="/candidates/create-profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Create Profile</Link>
                  <Link href="/candidates/career-resources" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Career Resources</Link>
                  <Link href="/candidates/resume-tips" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Resume Tips</Link>
                </div>
              )}
            </div>

            {/* For Employers Dropdown */}
            <div className="relative group">
              <button 
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                onMouseEnter={() => setEmployersOpen(true)}
                onMouseLeave={() => setEmployersOpen(false)}
              >
                For Employers
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {employersOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2"
                  onMouseEnter={() => setEmployersOpen(true)}
                  onMouseLeave={() => setEmployersOpen(false)}
                >
                  <Link href="/employers/post-job" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Post a Job</Link>
                  <Link href="/employers/pricing" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Pricing</Link>
                  <Link href="/employers/find-candidates" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Find Candidates</Link>
                  <Link href="/employers/hiring-solutions" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Hiring Solutions</Link>
                </div>
              )}
            </div>

            {/* Blog Link */}
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">
              Blog
            </Link>
          </nav>

          {/* Right Side Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              href="/post-job" 
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              Post a job
            </Link>
      
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden absolute right-4 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 mt-4">
              <Link href="/locations" className="text-gray-700 hover:text-blue-600 font-medium">Locations</Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium">Categories</Link>
              <Link href="/candidates" className="text-gray-700 hover:text-blue-600 font-medium">For Candidates</Link>
              <Link href="/employers" className="text-gray-700 hover:text-blue-600 font-medium">For Employers</Link>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">Blog</Link>
              <Link href="/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center">Post a job</Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">Log In</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
