'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, BookOpen, Clock, GraduationCap, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { Course } from '@/types';
import { useEnrollments } from '@/hooks/useEnrollments';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { isEnrolled } = useEnrollments();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          setEnrolled(isEnrolled(courseId));
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
    <div className="bg-gray-50 min-h-screen py-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <nav className="mb-6 text-sm">
          <Link href="/courses" className="text-primary-600 hover:text-primary-700">
            Courses
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{course.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-64 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-6">
                <span className="text-8xl" aria-hidden="true">{course.thumbnail}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {course.isFeatured && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded">
                    ⭐ Featured
                  </span>
                )}
                <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded">
                  {course.department}
                </span>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded">
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-gray-600 mb-4">{course.code}</p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1 text-xl">★</span>
                  <span className="font-semibold text-lg">{course.rating.toFixed(1)}</span>
                  <span className="text-gray-600 ml-2">({course.reviewCount} reviews)</span>
                </div>
                <div className="text-gray-600">
                  {course.studentsEnrolled}+ students enrolled
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>


            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Instructor
              </h2>
              <div className="flex items-start gap-4">
                <div className="text-6xl flex-shrink-0">{course.instructor.avatar}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {course.instructor.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{course.instructor.title}</p>
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-medium">{course.instructor.rating.toFixed(1)}</span>
                    <span className="text-gray-600 ml-1">Instructor Rating</span>
                  </div>
                  <p className="text-gray-700">{course.instructor.bio}</p>
                </div>
              </div>
            </div>


            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What You&apos;ll Learn
              </h2>
              <ul className="space-y-3">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6">
                      <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>


            {course.prerequisites.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Prerequisites
                </h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start">
                      <BookOpen className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}


            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Student Reviews
              </h2>
              <div className="space-y-6">
                {course.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="font-medium text-gray-900">{review.studentName}</span>
                      <span className="text-gray-500 text-sm ml-auto">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>


          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <div className="text-4xl font-bold text-primary-600 mb-4">
                ₹{course.price.toLocaleString()}
              </div>

              <div className="space-y-3 mb-6 text-gray-700">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-500 mr-2" />
                  <span>Duration: {course.duration}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 text-gray-500 mr-2" />
                  <span>Credits: {course.credits}</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="w-5 h-5 text-gray-500 mr-2" />
                  <span>Level: {course.level}</span>
                </div>
              </div>

              {enrolled ? (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center text-green-800 font-semibold">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Already Enrolled</span>
                  </div>
                </div>
              ) : (
                <Link href={`/enroll?courseId=${course.id}`}>
                  <Button fullWidth size="lg">
                    Enroll Now
                  </Button>
                </Link>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
                <p className="mb-2">This course includes:</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Full lifetime access
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Certificate of completion
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    Access on mobile and desktop
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Price</p>
            <p className="text-2xl font-bold text-primary-600">
              ₹{course.price.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 max-w-[200px]">
            {enrolled ? (
              <div className="bg-green-100 border border-green-300 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center text-green-800 font-semibold text-sm">
                  <Check className="w-4 h-4 mr-1" />
                  <span>Enrolled</span>
                </div>
              </div>
            ) : (
              <Link href={`/enroll?courseId=${course.id}`} className="block w-full">
                <Button fullWidth size="lg">
                  Enroll Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
