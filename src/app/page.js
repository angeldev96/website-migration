import React from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import Stats from '@/components/Stats';
import PopularCategories from '@/components/PopularCategories';
import FeaturedJobs from '@/components/FeaturedJobs';
import NewsletterSection from '@/components/NewsletterSection';

export const metadata = {
  title: "Yid Jobs - Jewish Jobs in Boro Park | Find Yiddish Employment Today",
  description: "The #1 Jewish job board for Boro Park. Find thousands of kosher job opportunities in the Orthodox Jewish community. Browse retail, healthcare, education, office, childcare and restaurant jobs. Join the largest Yiddish employment platform serving frum professionals.",
  keywords: "Jewish jobs Boro Park, Yiddish jobs Boro Park, Orthodox Jewish employment, kosher jobs, frum jobs, Shomer Shabbos jobs, Jewish community jobs, Boro Park employment, Boro Park jobs, Jewish job board, Yiddish career opportunities",
  openGraph: {
    title: "Yid Jobs - Jewish Jobs in Boro Park",
    description: "Find thousands of kosher job opportunities in Boro Park and the Orthodox Jewish community. The largest Yiddish employment platform.",
    url: "https://yidjobs.com",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yid Jobs - Jewish Jobs in Boro Park"
      }
    ]
  },
  alternates: {
    canonical: "https://yidjobs.com"
  }
};

const HomePage = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "name": "Browse Jewish Jobs in Boro Park",
    "description": "Find thousands of job opportunities in the Orthodox Jewish community of Boro Park",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Yid Jobs",
      "sameAs": "https://yidjobs.com"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Boro Park",
        "addressLocality": "Boro Park",
        "addressRegion": "NY",
        "addressCountry": "US"
      }
    },
    "employmentType": ["FULL_TIME", "PART_TIME", "CONTRACTOR"],
    "industry": "Jewish Community Services"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section with Background */}
      <div className="relative min-h-[600px] bg-linear-to-br from-gray-700 via-gray-600 to-gray-500 text-white overflow-hidden">
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

        <div className="absolute inset-0 bg-linear-to-r from-gray-900/30 to-transparent"></div>
        
        <section className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Jewish Jobs in Boro Park - Find Yiddish Employment Today
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              The #1 Orthodox Jewish job board for Boro Park. 
              Discover thousands of kosher career opportunities in the frum community. 
              Shomer Shabbos employers hiring now.
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
      <section className="bg-linear-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Thousands of Jewish Professionals in Boro Park
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Find your perfect kosher job in the Orthodox Jewish community. 
            From retail to healthcare, education to office work - we have opportunities for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/jobs" 
              className="bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg inline-block"
            >
              Browse All Jobs
            </Link>
            <Link 
              href="/post-job" 
              className="bg-blue-800 text-white px-8 py-3 rounded-md hover:bg-blue-900 transition-colors font-semibold text-lg shadow-lg inline-block"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* SEO Content Section - Hidden but crawlable */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Your Trusted Jewish Job Board for Boro Park
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                <strong>Yid Jobs</strong> is the premier employment platform serving the Orthodox Jewish community
                in Boro Park. We connect Jewish job seekers with kosher employers who value Shomer Shabbos
                workers and understand the unique needs of the frum community in Boro Park.
              </p>
              <p className="mb-4">
                Our platform features thousands of Yiddish-friendly job opportunities across multiple industries:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                <li>✓ Retail & Sales Jobs in Boro Park</li>
                <li>✓ Healthcare & Medical Positions in Boro Park</li>
                <li>✓ Education & Teaching Opportunities in Boro Park</li>
                <li>✓ Office & Administrative Work in Boro Park</li>
                <li>✓ Childcare & Babysitting Jobs in Boro Park</li>
                <li>✓ Restaurant & Food Service in Boro Park</li>
                <li>✓ Transportation & Delivery in Boro Park</li>
                <li>✓ Technical & IT Positions in Boro Park</li>
              </ul>
              <p className="mb-4">
                Whether you&apos;re seeking full-time employment, part-time work, or flexible opportunities 
                that accommodate Jewish holidays and Shabbos observance, Yid Jobs connects you with 
                employers who respect and celebrate your values. All positions are posted by verified 
                businesses within the Jewish community, ensuring a kosher work environment.
              </p>
              <p className="text-sm text-gray-600 italic">
                Proudly serving the Boro Park Orthodox Jewish community exclusively.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
