'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import SearchBar from '@/components/courses/CourseSearch';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useToast } from '@/hooks/useToast';

export default function MyEnrollmentsPage() {
  const { enrollments, removeEnrollment, isLoading } = useEnrollments();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);

  const filteredEnrollments = enrollments.filter((enrollment) =>
    enrollment.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCancelClick = (enrollmentId: string) => {
    setSelectedEnrollmentId(enrollmentId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedEnrollmentId) return;

    try {
      const response = await fetch(`/api/enrollments/${selectedEnrollmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        removeEnrollment(selectedEnrollmentId);
        toast.success('Enrollment cancelled successfully');
      } else {
        toast.error('Failed to cancel enrollment');
      }
    } catch (error) {
      toast.error('Failed to cancel enrollment');
    } finally {
      setCancelModalOpen(false);
      setSelectedEnrollmentId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            My Enrollments
          </h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          My Enrollments
        </h1>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/empty.svg"
                alt="No Enrollments"
                width={200}
                height={200}
                className="opacity-80"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No Enrollments Yet
            </h2>
            <p className="text-gray-600 mb-8">
              You haven&apos;t enrolled in any courses yet. Start learning today!
            </p>
            <Link href="/courses">
              <Button size="lg">Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search enrollments by course name or code..."
              />
            </div>

            {/* Enrollments List */}
            {filteredEnrollments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600">No enrollments found matching your search</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {enrollment.courseName}
                        </h3>
                        <p className="text-gray-600 mb-2">{enrollment.courseCode}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Enrolled:</span>{' '}
                            {new Date(enrollment.enrolledDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Student:</span> {enrollment.studentName}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {enrollment.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 flex-shrink-0">
                        <Link href={`/courses/${enrollment.courseId}`}>
                          <Button variant="outline">View Course</Button>
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => handleCancelClick(enrollment.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Enrollment"
      >
        <p className="text-gray-700 mb-6">
          Are you sure you want to cancel this enrollment? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={() => setCancelModalOpen(false)}>
            No, Keep It
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Yes, Cancel Enrollment
          </Button>
        </div>
      </Modal>
    </div>
  );
}
