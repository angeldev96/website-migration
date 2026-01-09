'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiUrl } from '@/lib/apiUrl';

const AdBanner = ({ position = 'side', className = '' }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl(`/api/ads?position=${position}`));
        const data = await response.json();
        if (data.success) {
          setAds(data.data);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [position]);

  if (loading && ads.length === 0) {
    if (position === 'side') {
      return (
        <div className={`hidden xl:flex flex-col gap-4 sticky top-24 ${className}`}>
          {[1, 2].map(i => (
            <div key={i} className="w-40 h-[400px] bg-gray-100 rounded-lg animate-pulse border border-gray-200"></div>
          ))}
        </div>
      );
    }
    return (
      <div className={`w-full py-4 ${className}`}>
        <div className="max-w-4xl mx-auto h-[90px] bg-gray-100 rounded-lg animate-pulse border border-gray-200"></div>
      </div>
    );
  }

  if (position === 'side') {
    return (
      <div className={`hidden xl:flex flex-col gap-4 sticky top-24 h-fit ${className}`}>
        {ads.map(ad => (
          <a 
            key={ad.id} 
            href={ad.linkUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <img 
              src={ad.imageUrl} 
              alt={ad.title || 'Advertisement'}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </a>
        ))}
        {ads.length === 0 && !loading && (
          <div className="w-40 h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center p-4 text-center">
            <span className="text-gray-400 text-xs font-medium italic">Your Ad Here</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full py-4 ${className}`}>
      {ads.map(ad => (
        <a 
          key={ad.id} 
          href={ad.linkUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block max-w-4xl mx-auto rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <img 
            src={ad.imageUrl} 
            alt={ad.title || 'Advertisement'}
            className="w-full h-auto"
          />
        </a>
      ))}
    </div>
  );
};

export default AdBanner;
