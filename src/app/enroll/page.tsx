'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import EnrollmentForm from '@/components/enrollment/EnrollmentForm';
import Spinner from '@/components/ui/Spinner';
import { Course } from '@/types';
import { useEnrollments } from '@/hooks/useEnrollments';

function EnrollmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId') || '';
  const { isEnrolled } = useEnrollments();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (isEnrolled(courseId)) {
      router.push(`/courses/${courseId}`);
      return;
    }

    if (!courseId) {
      router.push('/courses');
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
        } else if (response.status === 404) {
          router.push('/not-found');
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, isEnrolled, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <nav className="mb-6 text-sm">
          <Link href="/courses" className="text-primary-600 hover:text-primary-700">
            Courses
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/courses/${course.id}`} className="text-primary-600 hover:text-primary-700">
            {course.title}
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Enroll</span>
        </nav>


        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Enroll in {course.title}
          </h1>
          <p className="text-gray-600">
            Complete the form below to enroll in this course
          </p>
        </div>


        <div className="bg-white rounded-lg shadow-md p-6">
          <EnrollmentForm course={course} />
        </div>
      </div>
    </div>
  );
}

export default function EnrollPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <EnrollmentContent />
    </Suspense>
  );
}
