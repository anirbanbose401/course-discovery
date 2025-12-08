'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Course } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import CourseCard from '@/components/courses/CourseCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import FadeInSection from '@/components/ui/FadeInSection';

interface WishlistGridProps {
    allCourses: Course[];
}

export default function WishlistGrid({ allCourses }: WishlistGridProps) {
    const { favorites } = useFavorites();
    const [wishlistCourses, setWishlistCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const filtered = allCourses.filter(course => favorites.includes(course.id));
        setWishlistCourses(filtered);
        setLoading(false);
    }, [allCourses, favorites]);

    if (loading) {
        return <div className="py-20 text-center">Loading wishlist...</div>;
    }

    if (wishlistCourses.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="flex justify-center mb-6">
                    <Image
                        src="/wishlist.svg"
                        alt="Empty Wishlist"
                        width={200}
                        height={200}
                        className="opacity-80"
                    />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-8">
                    You haven't added any courses to your wishlist yet.
                </p>
                <Link href="/courses">
                    <Button size="lg">Browse Courses</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-gray-600 mt-2">
                    {wishlistCourses.length} {wishlistCourses.length === 1 ? 'course' : 'courses'} saved for later
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistCourses.map((course, index) => (
                    <FadeInSection key={course.id} delay={index * 50}>
                        <CourseCard course={course} showComparison={false} />
                    </FadeInSection>
                ))}
            </div>
        </>
    );
}
