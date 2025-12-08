'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import successAnimation from '../../../public/Success.json';

export default function EnrollmentSuccessPage() {
  const router = useRouter();

  const [countdown, setCountdown] = React.useState(10);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/enrollments');
    }
  }, [countdown, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-12">
          {/* Success Animation */}
          <Lottie animationData={successAnimation} loop={false} className="w-48 h-48 mx-auto mb-6" />

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Enrollment Successful!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Congratulations! You have successfully enrolled in the course.
            We&apos;ve sent a confirmation email with all the details.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              What&apos;s Next?
            </h2>
            <ul className="text-left space-y-3">
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6">
                  <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                </div>
                <span className="text-green-800">Check your email for course access details</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6">
                  <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                </div>
                <span className="text-green-800">Access course materials from your enrollment dashboard</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 flex-shrink-0 flex items-center justify-center w-6 h-6">
                  <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                </div>
                <span className="text-green-800">Join the course community and start learning</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/enrollments">
              <Button size="lg">View My Enrollments</Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg">
                Browse More Courses
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            You will be redirected to your enrollments in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
