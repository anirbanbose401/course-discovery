'use client';

import React from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Course } from '@/types';
import { useComparison } from '@/hooks/useComparison';
import { useToast } from '@/hooks/useToast';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  showComparison?: boolean;
}

export default function CourseCard({ course, showComparison = false }: CourseCardProps) {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const toast = useToast();
  const inComparison = isInComparison(course.id);

  const handleComparisonToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.checked) {
      const added = addToComparison(course);
      if (!added) {
        toast.warning('You can only compare up to 2 courses');
        e.target.checked = false;
      }
    } else {
      removeFromComparison(course.id);
    }
  };

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(course.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(course.id);
  };

  return (
    <Card hover className="h-full relative group">
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`h-5 w-5 transition-colors duration-200 ${favorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
            }`}
        />
      </button>

      <Link href={`/courses/${course.id}`} className="block h-full">
        <div className="p-4 h-full flex flex-col">
          {/* Thumbnail */}
          <div className="flex items-center justify-center h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex-shrink-0">
            <span className="text-6xl" aria-hidden="true">{course.thumbnail}</span>
          </div>

          {/* Course Info */}
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1 min-h-[3.5rem]">
                {course.title}
              </h3>
              {course.isFeatured && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded flex-shrink-0">
                  ⭐ Featured
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600">{course.code}</p>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{course.department}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{course.level}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1" aria-hidden="true">★</span>
                <span className="font-medium text-sm text-gray-900">{course.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-400 text-sm">({course.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{course.instructor.avatar}</span>
              <span>{course.instructor.name}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t mt-auto">
              <div>
                <p className="text-2xl font-bold text-primary-600">₹{course.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{course.duration}</p>
              </div>
              <div className="text-sm text-gray-600">
                {course.studentsEnrolled}+ enrolled
              </div>
            </div>

            {showComparison && (
              <div className="flex items-center gap-2 pt-2" onClick={(e) => e.preventDefault()}>
                <input
                  type="checkbox"
                  id={`compare-${course.id}`}
                  checked={inComparison}
                  onChange={handleComparisonToggle}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor={`compare-${course.id}`} className="text-sm text-gray-700 cursor-pointer">
                  Compare
                </label>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
