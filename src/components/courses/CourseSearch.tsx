'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
  sortBy,
  onSortChange
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('search_history');
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse search history');
    }
  }, []);

  // Debounce the search to prevent re-fetching on every single keystroke.
  // 300ms feels snappier than 500ms but still saves a lot of API calls.
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query || '');
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    // We'll trust the debounce effect to handle the actual search trigger
    // rather than doing it here directly.
  };

  const saveToHistory = (term: string) => {
    if (!term || term.trim().length < 2) return;
    const history = [term, ...searchHistory.filter(h => h !== term)].slice(0, 3);
    setSearchHistory(history);
    localStorage.setItem('search_history', JSON.stringify(history));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          // Small delay to let the click event register on the dropdown items before they disappear
          onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              saveToHistory(query || '');
              setShowHistory(false);
            }
          }}
          placeholder={placeholder}
          className="w-full h-12 px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
          aria-label="Search"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>


        {showHistory && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-auto">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
              Recent Searches
            </div>
            {searchHistory.map((term, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors"
                onClick={() => {
                  setQuery(term);
                  onSearch(term);

                  // Refresh the history order so this term bubbles to top
                  saveToHistory(term);
                  setShowHistory(false);
                }}
              >
                <span className="text-gray-700">{term}</span>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {onSortChange && (
        <div className="sm:w-56">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 cursor-pointer appearance-none"
            aria-label="Sort courses"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: `right 0.5rem center`,
              backgroundRepeat: `no-repeat`,
              backgroundSize: `1.5em 1.5em`,
              paddingRight: `2.5rem`
            }}
          >
            <option value="">Sort By: Best Match</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      )}
    </div>
  );
}
