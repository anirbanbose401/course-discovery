'use client';

import React, { useEffect, useState } from 'react';
import CountUp from '@/components/ui/CountUp';
import FadeInSection from '@/components/ui/FadeInSection';
import Link from 'next/link';
import CourseCard from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/Button';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Course, Department } from '@/types';
import { useToast } from '@/hooks/useToast';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, deptRes] = await Promise.all([
          fetch('/api/courses/featured'),
          fetch('/api/departments'),
        ]);

        if (coursesRes.ok && deptRes.ok) {
          const courses = await coursesRes.json();
          const depts = await deptRes.json();
          setFeaturedCourses(courses.slice(0, 6));
          setDepartments(depts);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (response.ok) {
        toast.success('Successfully subscribed to newsletter!');
        setNewsletterEmail('');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Next Skill
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Browse high-quality courses across 12+ categories and learn from expert instructors
          </p>
          <Link href="/courses">
            <Button size="lg" variant="white" className="hover:bg-gray-100">
              Browse Courses
            </Button>
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <FadeInSection delay={0}>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                <CountUp end={60} suffix="+" />
              </div>
              <div className="text-gray-600">Quality Courses</div>
            </FadeInSection>
            <FadeInSection delay={200}>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                <CountUp end={12} />
              </div>
              <div className="text-gray-600">Categories</div>
            </FadeInSection>
            <FadeInSection delay={400}>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                <CountUp end={1000} suffix="+" />
              </div>
              <div className="text-gray-600">Happy Students</div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked courses to help you get started
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonList count={6} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course, index) => (
                <FadeInSection key={course.id} delay={index * 100}>
                  <CourseCard course={course} />
                </FadeInSection>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button variant="outline" size="lg">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600">
              Choose from 12 different departments
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <FadeInSection key={dept.id} delay={index * 50}>
                <Link
                  href={`/courses?department=${encodeURIComponent(dept.name)}`}
                  className="bg-gray-50 hover:bg-primary-50 rounded-lg p-6 text-center transition-colors border border-gray-200 hover:border-primary-300 block h-full"
                >
                  <div className="text-4xl mb-3">{dept.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{dept.name}</h3>
                  <p className="text-sm text-gray-600">{dept.courseCount} courses</p>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CourseHub?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FadeInSection delay={0}>
              <div className="text-center">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Expert Instructors</h3>
                <p className="text-gray-700">
                  Learn from industry professionals with years of experience
                </p>
              </div>
            </FadeInSection>
            <FadeInSection delay={200}>
              <div className="text-center">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Practical Skills</h3>
                <p className="text-gray-700">
                  Gain hands-on experience with real-world projects
                </p>
              </div>
            </FadeInSection>
            <FadeInSection delay={400}>
              <div className="text-center">
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Flexible Learning</h3>
                <p className="text-gray-700">
                  Study at your own pace, anytime and anywhere
                </p>
              </div>
            </FadeInSection>
            <FadeInSection delay={600}>
              <div className="text-center">
                <div className="text-5xl mb-4">📜</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Certificates</h3>
                <p className="text-gray-700">
                  Earn recognized certificates upon course completion
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
          </div>

          <FadeInSection>
            <TestimonialCarousel />
          </FadeInSection>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Subscribe to our newsletter for the latest courses and updates
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                required
                suppressHydrationWarning
                className="px-4 py-3 rounded-lg text-gray-900 flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button
                type="submit"
                disabled={subscribing}
                variant="white"
                className="hover:bg-gray-100"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
