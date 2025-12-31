'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Zap, ShieldCheck } from 'lucide-react';

// Detect if device is a dumb phone or very small screen
function isDumbPhone() {
  // Check screen width (very small screens < 360px)
  if (typeof window !== 'undefined' && window.innerWidth < 360) {
    return true;
  }

  // Check for feature phone user agents
  const ua = navigator.userAgent || '';
  const dumbPhonePatterns = [
    /nokia/i,
    /samsung.*browser/i,
    /lg.*browser/i,
    /opera mini/i,
    /ucbrowser/i,
    /netfront/i,
    /midp/i,
    /up\.browser/i,
    /phone/i,
  ];

  return dumbPhonePatterns.some(pattern => pattern.test(ua));
}

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Don't show on dumb phones or very small screens
    if (isDumbPhone()) {
      return;
    }

    // Check if the user has already seen the welcome message
    const hasVisited = localStorage.getItem('hasVisitedNewSite');
    if (!hasVisited) {
      // Small delay to ensure the page is loaded and it feels more natural
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasVisitedNewSite', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500 ease-out"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close welcome message"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-8 md:p-10">
          {/* Icon Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Welcome to the New Yiddish Jobs!
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            We&apos;ve upgraded our platform to provide you with a faster, more reliable, and modern experience. 
            While we&apos;ve moved to better technology, everything you know and trust about Yiddish Jobs remains exactly the same.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Faster Performance</h3>
                <p className="text-sm text-gray-500 mt-1 leading-snug">Optimized for speed on all devices.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Better Reliability</h3>
                <p className="text-sm text-gray-500 mt-1 leading-snug">Built on modern, stable infrastructure.</p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="bg-gray-50 -mx-8 md:-mx-10 px-8 md:px-10 py-6 mb-8">
            <p className="text-sm text-gray-600 leading-relaxed">
              This is just the beginning. We&apos;ll be adding new features soon to make finding your next opportunity even easier.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl transition-all transform active:scale-[0.98] shadow-xl shadow-blue-200 flex items-center justify-center"
          >
            Got it, let&apos;s explore!
          </button>
        </div>
      </div>
    </div>
  );
}
