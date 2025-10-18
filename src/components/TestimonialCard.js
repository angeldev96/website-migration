import React from 'react';

export default function TestimonialCard({ quote, name, location, rating = 5, avatar }) {
  return (
    <article className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="text-4xl text-gray-400 mb-4">“</div>

      <div className="flex items-center mb-4">
        <div className="flex items-center text-yellow-400 space-x-1">
          {Array.from({ length: rating }).map((_, i) => (
            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.84-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
            </svg>
          ))}
        </div>
      </div>

      <blockquote className="text-gray-700 mb-6 leading-relaxed">
        {quote}
      </blockquote>

      <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl">{avatar || '👤'}</div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">{location}</div>
        </div>
      </div>
    </article>
  );
}
