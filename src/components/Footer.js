import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="https://cdn.prod.website-files.com/67f2f66843f44cc07e764676/68b9a60095ee55fe840f7e34_New%20Yiddish%20Jobs%20Logo.png"
              alt="Yiddish Jobs Logo"
              width={140}
              height={36}
              className="h-8 w-auto brightness-0"
            />
            <span className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Yiddish Jobs</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy</Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
