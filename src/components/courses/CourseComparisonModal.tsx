'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Course } from '@/types';
import { useComparison } from '@/hooks/useComparison';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
  const { comparisonCourses, clearComparison } = useComparison();

  const handleClearAndClose = () => {
    clearComparison();
    onClose();
  };

  const comparisonRows = [
    { label: 'Title', getValue: (course: Course) => course.title },
    { label: 'Code', getValue: (course: Course) => course.code },
    { label: 'Department', getValue: (course: Course) => course.department },
    { label: 'Level', getValue: (course: Course) => course.level },
    { label: 'Price', getValue: (course: Course) => `₹${course.price.toLocaleString()}` },
    { label: 'Duration', getValue: (course: Course) => course.duration },
    { label: 'Credits', getValue: (course: Course) => `${course.credits} credits` },
    { label: 'Rating', getValue: (course: Course) => `${course.rating}/5 (${course.reviewCount} reviews)` },
    { label: 'Instructor', getValue: (course: Course) => course.instructor.name },
    { label: 'Students Enrolled', getValue: (course: Course) => `${course.studentsEnrolled}+` },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Course Comparison" size="xl">
      {comparisonCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No courses selected for comparison</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                  {comparisonCourses.map((course) => (
                    <th key={course.id} className="text-left py-3 px-4 font-semibold text-gray-900">
                      Course {comparisonCourses.indexOf(course) + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">{row.label}</td>
                    {comparisonCourses.map((course) => (
                      <td key={course.id} className="py-3 px-4 text-gray-600">
                        {row.getValue(course)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-4 justify-end">
            <Button variant="secondary" onClick={handleClearAndClose}>
              Clear Comparison
            </Button>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
