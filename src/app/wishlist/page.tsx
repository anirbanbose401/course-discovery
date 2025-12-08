import React from 'react';
import coursesData from '@/data/courses.json';
import { Course } from '@/types';
import WishlistGrid from '@/components/courses/WishlistGrid';

export const metadata = {
    title: 'My Wishlist | CourseHub',
    description: 'View your saved favorite courses.',
};

export default function WishlistPage() {
    const courses = coursesData as Course[];

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <WishlistGrid allCourses={courses} />
            </div>
        </div>
    );
}
