'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { apiUrl } from '@/lib/apiUrl';

const AdBanner = ({ position = 'left-side', className = '' }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSide = position === 'left-side' || position === 'right-side' || position === 'side';
  const limit = useMemo(() => (isSide ? 12 : 1), [isSide]);

  // Keep side banners uniform.
  const sideBoxClass = 'w-60 h-[600px]';

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl(`/api/ads?position=${position}&limit=${limit}`));
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
  }, [position, limit]);

  if (loading && ads.length === 0) {
    if (isSide) {
      return (
        <div className={`hidden xl:flex flex-col gap-4 ${className}`}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${sideBoxClass} bg-gray-100 rounded-lg animate-pulse border border-gray-200`}></div>
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

  if (isSide) {
    const displayAds = ads.slice(0, limit);
    return (
      <div className={`hidden xl:flex flex-col gap-4 ${className}`}>
        {displayAds.map(ad => (
          <a 
            key={ad.id} 
            href={ad.linkUrl || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`block ${sideBoxClass} rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white`}
          >
            <img 
              src={ad.imageUrl} 
              alt={ad.title || 'Advertisement'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </a>
        ))}
        {ads.length === 0 && !loading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`${sideBoxClass} bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center p-4 text-center`}>
                <span className="text-gray-400 text-xs font-medium italic">Your Ad Here</span>
              </div>
            ))}
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
