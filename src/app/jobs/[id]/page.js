import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { id } = await params;
  const jobId = parseInt(id);
  
  try {
    const job = await prisma.jobsSheet.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return {
        title: 'Job Not Found - Yid Jobs - Jewish Jobs in Boro Park',
        description: 'This job listing is no longer available. Browse thousands of other Jewish job opportunities in Boro Park.',
      };
    }

    const jobTitle = job.aiTitle || job.jobTitle;
    const jobDesc = job.aiDescription || job.description || '';
    const location = 'Boro Park'; // site focuses on Boro Park

    // Build a focused, readable meta description (<= 155 chars when possible)
    const pieces = [];
    if (job.company) pieces.push(`Hiring: ${job.company}`);
    if (job.category) pieces.push(job.category);
    if (job.jobDate) pieces.push(`Posted ${new Date(job.jobDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
    if (job.description) pieces.push(excerpt(job.description, 80));

    const baseDesc = `${jobTitle} — ${pieces.filter(Boolean).join(' • ')}`;
    const truncatedDesc = baseDesc.length > 155 ? baseDesc.substring(0, 152).trim() + '...' : baseDesc;

    // Keywords array (helpful but Google ignores meta keywords mostly). Keep it targeted.
    const keywordsArr = [jobTitle, job.company, job.category, location, job.genderCategory].filter(Boolean).slice(0, 12);

    return {
      title: `${jobTitle} — ${job.company ? job.company + ' | ' : ''}Jobs in ${location} | Yid Jobs`,
      description: truncatedDesc,
      keywords: keywordsArr.join(', '),
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1
        }
      },
      authors: job.company ? [{ name: job.company }] : [{ name: 'Yid Jobs' }],
      openGraph: {
        title: `${jobTitle} - Jobs in ${location}`,
        description: truncatedDesc,
        url: `https://yidjobs.com/jobs/${jobId}`,
        type: 'article',
        publishedTime: job.jobDate?.toISOString(),
        modifiedTime: job.updatedAt?.toISOString(),
        images: [
          {
            url: '/og-image.png',
            width: 1200,
            height: 630,
            alt: `${jobTitle} - Yid Jobs`
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: `${jobTitle} - Jewish Jobs`,
        description: truncatedDesc,
        images: ['/og-image.png']
      },
      alternates: {
        canonical: `https://yidjobs.com/jobs/${jobId}`
      },
      other: {
        'job-category': job.category,
        'job-location': location,
        'job-type': job.genderCategory || 'Any',
      }
    };
  } catch (error) {
    return {
      title: 'Job Details - Yid Jobs - Jewish Jobs in Boro Park',
      description: 'View job details and apply for positions in the Orthodox Jewish community of Boro Park.',
    };
  }
}

// Small helper to create short excerpts for metadata
function excerpt(text, maxLen = 120) {
  const plain = (text || '').replace(/\s+/g, ' ').trim();
  if (plain.length <= maxLen) return plain;
  return plain.substring(0, maxLen - 1).trim() + '…';
}

async function getJob(id) {
  try {
    const job = await prisma.jobsSheet.findUnique({
      where: { id: parseInt(id) }
    });
    return job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export default async function JobDetailPage({ params }) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'America/New_York'
    });
  };

  const extractLocation = (description) => {
    // Always return Boro Park as the primary location
    return 'Boro Park';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Accounting': '📊', 'Technology': '💻', 'Education': '📚',
      'Healthcare': '⚕️', 'Sales': '📈', 'Marketing': '📈',
      'Administration': '📋', 'Customer Service': '🎧', 'Finance': '💰',
      'IT': '💻', 'Childcare': '👶', 'Food': '🍽️',
      'Retail': '🛍️', 'Construction': '🏗️', 'Transportation': '🚗',
      'Legal': '⚖️', 'Real Estate': '🏠', 'Human Resources': '👥',
      'Design': '🎨', 'Writing': '✍️'
    };
    
    for (const [key, icon] of Object.entries(icons)) {
      if (category?.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return '💼';
  };

  const getJobType = (description) => {
    const fullTimeKeywords = ['full-time', 'full time', 'fulltime'];
    const partTimeKeywords = ['part-time', 'part time', 'parttime'];
    const lowerDesc = description?.toLowerCase() || '';
    
    if (fullTimeKeywords.some(keyword => lowerDesc.includes(keyword))) {
      return 'Full Time';
    }
    if (partTimeKeywords.some(keyword => lowerDesc.includes(keyword))) {
      return 'Part Time';
    }
    return 'Full Time';
  };

  // Map carrier strings to a small display object (initials + friendly name)
  const getCarrierInfo = (carrierString) => {
    if (!carrierString) return null;
    const s = carrierString.trim();
    const lower = s.toLowerCase();

    const map = [
      {
        key: 'verizon',
        name: 'Verizon',
        initials: 'VZ',
        // Provided by user
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Verizon_2024.svg/1200px-Verizon_2024.svg.png'
      },
      {
        key: 't-mobile',
        name: 'T-Mobile',
        initials: 'TM',
        imageUrl: 'https://icons.iconarchive.com/icons/martz90/circle-addon1/512/t-mobile-icon.png'
      },
      {
        key: 'att',
        name: "AT&T",
        initials: 'AT',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQa_TW8c50QW6VMUAsHEsrXkVQIjtq4LqiXQw&s'
      },
      { key: 'google', name: 'Google (Grand Central)', initials: 'G', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcE7TJD-4sN2HtCv8mmQj6DcSiBGrj1MSPiA&s' },
      { key: 'twilio', name: 'Twilio', initials: 'TW', imageUrl: 'https://logos-world.net/wp-content/uploads/2024/02/Twilio-Logo.png' },
      { key: 'bandwidth', name: 'Bandwidth', initials: 'BW' },
      { key: 'onvoy', name: 'Onvoy', initials: 'ON' },
      { key: 'telnyx', name: 'Telnyx', initials: 'TX', imageUrl: 'https://cdn.prod.website-files.com/621de55357719363b658d18c/6305d8f82c2835929ee69eb7_blog-article_placeholder_img%402x.png' },
      { key: 'peerless', name: 'Peerless Network', initials: 'PN', imageUrl: 'https://www.peerlessnetwork.com/wp-content/uploads/2016/09/peerless-favicon.png' },
      { key: 'charter', name: 'Charter / Cablevision', initials: 'CH' },
      { key: 'numberbarn', name: 'NumberBarn', initials: 'NB' },
      { key: 'xchange', name: 'Xchange Telecom', initials: 'XC' },
    ];

    for (const m of map) {
      if (lower.includes(m.key)) {
        return {
          displayName: m.name,
          initials: m.initials,
          imageUrl: m.imageUrl,
        };
      }
    }

    // Fallback: try to extract a short friendly name
    const fallbackName = s.replace(/\s*\/.+$/, '').trim();
    const initials = fallbackName.split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase() || 'CP';
    return { displayName: fallbackName, initials };
  };

  // Extract salary information if available
  const extractSalary = (description) => {
    const salaryMatch = description?.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*(?:per|\/)\s*(?:hour|hr|year|yr|annually))?/i);
    return salaryMatch ? salaryMatch[0] : null;
  };

  const salary = extractSalary(job.description);
  const location = extractLocation(job.description);
  const jobType = getJobType(job.description);
  const carrierInfo = getCarrierInfo(job.carrierPhone);

  // JSON-LD Schema for JobPosting
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.aiTitle || job.jobTitle,
    "description": job.aiDescription || job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": "Yid Jobs",
      "value": job.id.toString()
    },
    "datePosted": job.jobDate?.toISOString() || new Date().toISOString(),
    "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    "employmentType": jobType === 'Full Time' ? 'FULL_TIME' : 'PART_TIME',
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company || "Yid Jobs",
      "sameAs": "https://yidjobs.com",
      "logo": "https://yidjobs.com/favico.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Boro Park",
        "addressRegion": "NY",
        "addressCountry": "US",
        "streetAddress": "Boro Park"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Place",
      "name": "Boro Park"
    },
    "jobLocationType": "TELECOMMUTE",
    "industry": "Jewish Community Services",
    "occupationalCategory": job.category,
    ...(salary && {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "value": salary,
          "unitText": "HOUR"
        }
      }
    })
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://yidjobs.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Jobs",
        "item": "https://yidjobs.com/jobs"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": job.aiTitle || job.jobTitle,
        "item": `https://yidjobs.com/jobs/${job.id}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Job Details</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-all duration-300 animate-fade-in"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>

          {/* Main Job Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in-up animation-delay-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0 animate-fade-in-up animation-delay-300">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl sm:text-4xl border-2 border-white/30">
                    {getCategoryIcon(job.category)}
                  </div>
                </div>

                {/* Title and Company */}
                <div className="flex-1 animate-fade-in-up animation-delay-400">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                    {job.aiTitle || job.jobTitle}
                  </h1>
                  {job.company && (
                    <div className="flex items-center gap-2 text-lg sm:text-xl mb-4">
                      <span>{job.company}</span>
                      {job.companyVerified && (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 text-white/90 text-sm animate-fade-in-up animation-delay-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{extractLocation(job.description)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{getJobType(job.description)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Posted {formatDate(job.jobDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 animate-fade-in-up animation-delay-600">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Job Description */}
                  <div className="animate-fade-in-up animation-delay-700">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">📄</span>
                      Job Description
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {job.aiDescription || job.description}
                      </p>
                    </div>
                  </div>

                  {/* Yiddish Translation if available */}
                  {(job.titleYiddish || job.descriptionYiddish) && (
                    <div className="border-t border-gray-200 pt-8 animate-fade-in-up animation-delay-800">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        יידיש (Yiddish)
                      </h2>
                      {job.titleYiddish && (
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {job.titleYiddish}
                        </h3>
                      )}
                      {job.descriptionYiddish && (
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {job.descriptionYiddish}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6 animate-fade-in-up animation-delay-900">
                  {/* Apply Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 sticky top-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Apply for this position</h3>
                    
                    {/* Contact Info */}
                    <div className="space-y-3 mb-6">
                      {job.emailInfo && (
                        <a 
                          href={`mailto:${job.emailInfo}`}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-600 font-medium">Email</div>
                            <div className="text-sm text-gray-900 font-semibold truncate">{job.emailInfo}</div>
                          </div>
                        </a>
                      )}
                      
                      {job.phoneNumber && (
                        <a 
                          href={`tel:${job.phoneNumber}`}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all group"
                        >
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-600 font-medium">Phone</div>
                            <div className="text-sm text-gray-900 font-semibold break-all whitespace-normal">{job.phoneNumber}</div>
                          </div>
                        </a>
                      )}
                      {/* Carrier display (icon/initials + name) */}
                      {carrierInfo && (
                        <div className="flex items-center gap-4 p-3 bg-white rounded-lg transition-all">
                          {/* Show rectangular logo image if available, otherwise initials fallback */}
                          {carrierInfo.imageUrl ? (
                            <div className="w-24 flex items-center justify-start">
                              <Image
                                src={carrierInfo.imageUrl}
                                alt={carrierInfo.displayName}
                                width={96}
                                height={32}
                                unoptimized
                                className="w-20 max-h-10 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-10 bg-gray-100 rounded-md flex items-center justify-center text-lg font-bold text-gray-700">
                              {carrierInfo.initials}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-600 font-medium">Carrier</div>
                            <div className="text-sm text-gray-900 font-semibold truncate">{carrierInfo.displayName}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 text-center">
                      Click to contact the employer directly
                    </p>
                  </div>

                  {/* Job Details Card */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Job Details</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 font-medium mb-1">Category</div>
                        <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {job.category}
                        </div>
                      </div>
                      
                      {job.genderCategory && job.genderCategory !== 'Any' && (
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">Gender Category</div>
                          <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            {job.genderCategory}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500 font-medium mb-2">Job ID</div>
                        <div className="text-sm text-gray-700 font-mono">#{job.id}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Jobs - Coming Soon */}
          <div className="mt-12 animate-fade-in-up animation-delay-1000">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Opportunities</h2>
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-600">Similar job recommendations coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
