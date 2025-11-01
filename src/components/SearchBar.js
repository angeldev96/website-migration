'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('search', keyword);
      if (location) params.set('location', location);
      params.set('limit', '12');

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const json = await res.json();
      if (json && json.success) {
        setResults(json.data || []);
      } else {
        setResults([]);
        setError(json?.error || 'No results');
      }
    } catch (err) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-blue-600 font-semibold text-lg mb-2">What job do you want?</h2>
      </div>

      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Title or Keywords"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full px-4 py-3 text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
          />
        </div>
        <div className="flex-1">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 text-gray-700 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md bg-white appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '3rem'
            }}
          >
            <option value="">All Locations</option>
            <option value="boro-park">Boro Park</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
        >
          Search
        </button>
      </form>

      {/* Results area */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        {loading && <p className="text-gray-600">Searching...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && results.length === 0 && (
          <p className="text-gray-600">No jobs found. Try different keywords.</p>
        )}

        {!loading && results.length > 0 && (
          <ul className="space-y-4">
            {results.map((job) => (
              <li key={job.id} className="border border-gray-100 rounded-md p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <Link href={`/jobs/${job.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
                      {job.jobTitle || job.aiTitle || 'Untitled Job'}
                    </Link>
                    <p className="text-sm text-gray-600">{job.company || ''}</p>
                    <p className="mt-2 text-gray-700">{(job.aiDescription || job.description || '').slice(0, 180)}{(job.aiDescription || job.description || '').length > 180 ? '...' : ''}</p>
                  </div>
                  <div className="text-sm text-gray-500 md:text-right">
                    <div>{job.category}</div>
                    <div className="mt-2">{job.jobDate ? new Date(job.jobDate).toLocaleDateString() : ''}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
