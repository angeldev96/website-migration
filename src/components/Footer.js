import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Image 
              src="https://cdn.prod.website-files.com/67f2f66843f44cc07e764676/68b9a60095ee55fe840f7e34_New%20Yiddish%20Jobs%20Logo.png" 
              alt="Yiddish Jobs Logo" 
              width={150} 
              height={40}
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-gray-400 mb-4 text-sm">
              The largest Jewish jobs platform connecting talented professionals with employers in the Jewish community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452zm15.106-20.452h-20.454c-.979 0-1.771.774-1.771 1.729v20.542c0 .956.792 1.729 1.771 1.729h20.451c.978 0 1.771-.773 1.771-1.729v-20.542c0-.955-.793-1.729-1.771-1.729z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/candidates/create-profile" className="hover:text-white transition-colors">Create Profile</Link></li>
              <li><Link href="/candidates/career-resources" className="hover:text-white transition-colors">Career Resources</Link></li>
              <li><Link href="/candidates/resume-tips" className="hover:text-white transition-colors">Resume Tips</Link></li>
              <li><Link href="/saved-jobs" className="hover:text-white transition-colors">Saved Jobs</Link></li>
              <li><Link href="/job-alerts" className="hover:text-white transition-colors">Job Alerts</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/employers/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link href="/employers/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/employers/find-candidates" className="hover:text-white transition-colors">Find Candidates</Link></li>
              <li><Link href="/employers/hiring-solutions" className="hover:text-white transition-colors">Hiring Solutions</Link></li>
              <li><Link href="/employers/manage-jobs" className="hover:text-white transition-colors">Manage Jobs</Link></li>
              <li><Link href="/employers/faq" className="hover:text-white transition-colors">Employer FAQ</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/locations" className="hover:text-white transition-colors">All Locations</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">All Categories</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Popular Locations */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h3 className="text-white font-semibold text-lg mb-4">Popular Locations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
            <Link href="/locations/boro-park" className="hover:text-white transition-colors">Boro Park</Link>
            <Link href="/locations/williamsburg" className="hover:text-white transition-colors">Williamsburg</Link>
            <Link href="/locations/crown-heights" className="hover:text-white transition-colors">Crown Heights</Link>
            <Link href="/locations/flatbush" className="hover:text-white transition-colors">Flatbush</Link>
            <Link href="/locations/lakewood" className="hover:text-white transition-colors">Lakewood</Link>
            <Link href="/locations/monsey" className="hover:text-white transition-colors">Monsey</Link>
            <Link href="/locations/five-towns" className="hover:text-white transition-colors">Five Towns</Link>
            <Link href="/locations/manhattan" className="hover:text-white transition-colors">Manhattan</Link>
            <Link href="/locations/queens" className="hover:text-white transition-colors">Queens</Link>
            <Link href="/locations/teaneck" className="hover:text-white transition-colors">Teaneck</Link>
            <Link href="/locations/passaic" className="hover:text-white transition-colors">Passaic</Link>
            <Link href="/locations/baltimore" className="hover:text-white transition-colors">Baltimore</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Yiddish Jobs. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
