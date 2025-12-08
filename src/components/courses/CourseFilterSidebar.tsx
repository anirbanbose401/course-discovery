'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { FilterState } from '@/types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  departments: string[];
  onClearFilters: () => void;
  totalCourses: number;
  currentPage: number;
  coursesPerPage: number;
  loading: boolean;
  className?: string;
  variant?: 'sidebar' | 'embedded';
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  departments,
  onClearFilters,
  totalCourses,
  currentPage,
  coursesPerPage,
  loading,
  className = '',
  variant = 'sidebar'
}: FilterSidebarProps) {
  const handleLevelChange = (level: string) => {
    const newLevels = filters.level.includes(level)
      ? filters.level.filter(l => l !== level)
      : [...filters.level, level];
    onFilterChange({ ...filters, level: newLevels });
  };

  const containerClasses = variant === 'sidebar'
    ? `bg-white p-6 rounded-lg shadow-md sticky top-20 ${className}`
    : `bg-transparent ${className}`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            {(filters.department || filters.level.length > 0 || filters.minPrice || filters.maxPrice) && (
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {(filters.department ? 1 : 0) +
                  filters.level.length +
                  (filters.minPrice ? 1 : 0) +
                  (filters.maxPrice ? 1 : 0)}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
        <p className="text-sm text-gray-600 font-medium">
          {loading ? 'Loading...' : `Showing ${totalCourses > 0 ? (currentPage - 1) * coursesPerPage + 1 : 0}-${Math.min(currentPage * coursesPerPage, totalCourses)} of ${totalCourses} courses`}
        </p>
      </div>

      {/* Department Filter */}
      <div className="mb-6">
        <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
          Department
        </label>
        <select
          id="department"
          value={filters.department}
          onChange={(e) => onFilterChange({ ...filters, department: e.target.value })}
          className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Level
        </label>
        <div className="space-y-2">
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <div key={level} className="flex items-center">
              <input
                type="checkbox"
                id={`level-${level}`}
                checked={filters.level.includes(level)}
                onChange={() => handleLevelChange(level)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor={`level-${level}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range (₹)
        </label>
        <div className="space-y-3">
          {/* Min Price */}
          <div className="relative flex items-center">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                onFilterChange({ ...filters, minPrice: value });
              }}
              onKeyDown={(e) => {
                if (
                  !/\d/.test(e.key) &&
                  !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 appearance-none"
              min="0"
            />
            <div className="absolute right-1 flex flex-col gap-[1px]">
              <button
                onClick={() => onFilterChange({ ...filters, minPrice: String(Number(filters.minPrice || 0) + 500) })}
                className="bg-gray-100 hover:bg-gray-200 p-[1px] rounded-t border border-gray-300"
                aria-label="Increase min price"
              >
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => onFilterChange({ ...filters, minPrice: String(Math.max(0, Number(filters.minPrice || 0) - 500)) })}
                className="bg-gray-100 hover:bg-gray-200 p-[1px] rounded-b border border-gray-300"
                aria-label="Decrease min price"
              >
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Max Price */}
          <div className="relative flex items-center">
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                onFilterChange({ ...filters, maxPrice: value });
              }}
              onKeyDown={(e) => {
                if (
                  !/\d/.test(e.key) &&
                  !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 appearance-none"
              min="0"
            />
            <div className="absolute right-1 flex flex-col gap-[1px]">
              <button
                onClick={() => onFilterChange({ ...filters, maxPrice: String(Number(filters.maxPrice || 0) + 500) })}
                className="bg-gray-100 hover:bg-gray-200 p-[1px] rounded-t border border-gray-300"
                aria-label="Increase max price"
              >
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => onFilterChange({ ...filters, maxPrice: String(Math.max(0, Number(filters.maxPrice || 0) - 500)) })}
                className="bg-gray-100 hover:bg-gray-200 p-[1px] rounded-b border border-gray-300"
                aria-label="Decrease max price"
              >
                <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
