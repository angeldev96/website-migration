'use client';

import React, { useState } from 'react';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', { keyword, location });
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
            <option value="boro-park">Boro Park, Brooklyn</option>
            <option value="williamsburg">Williamsburg, Brooklyn</option>
            <option value="crown-heights">Crown Heights, Brooklyn</option>
            <option value="flatbush">Flatbush, Brooklyn</option>
            <option value="monsey">Monsey, NY</option>
            <option value="lakewood">Lakewood, NJ</option>
            <option value="five-towns">Five Towns, NY</option>
            <option value="manhattan">Manhattan, NY</option>
            <option value="queens">Queens, NY</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
