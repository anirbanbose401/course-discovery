'use client';

import { useState, useEffect, useCallback } from 'react';
import { Enrollment } from '@/types';

const ENROLLMENTS_KEY = 'course-enrollments';

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    try {
      const stored = localStorage.getItem(ENROLLMENTS_KEY);
      if (stored) {
        setEnrollments(JSON.parse(stored));
      }

    } catch (error) {
      console.error('Failed to load enrollments:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const saveEnrollments = useCallback((newEnrollments: Enrollment[]) => {
    try {
      localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(newEnrollments));
      setEnrollments(newEnrollments);
    } catch (error) {
      console.error('Failed to save enrollments:', error);
    }
  }, []);

  const addEnrollment = useCallback((enrollment: Enrollment) => {
    const newEnrollments = [...enrollments, enrollment];
    saveEnrollments(newEnrollments);
  }, [enrollments, saveEnrollments]);

  const removeEnrollment = useCallback((enrollmentId: string) => {
    const newEnrollments = enrollments.filter(e => e.id !== enrollmentId);
    saveEnrollments(newEnrollments);
  }, [enrollments, saveEnrollments]);

  const isEnrolled = useCallback((courseId: string): boolean => {
    return enrollments.some(e => e.courseId === courseId);
  }, [enrollments]);

  const getEnrollmentByCourseId = useCallback((courseId: string): Enrollment | undefined => {
    return enrollments.find(e => e.courseId === courseId);
  }, [enrollments]);

  return {
    enrollments,
    isLoading,
    addEnrollment,
    removeEnrollment,
    isEnrolled,
    getEnrollmentByCourseId,
  };
}
