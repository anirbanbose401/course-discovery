'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Course } from '@/types';

interface ComparisonContextType {
  comparisonCourses: Course[];
  addToComparison: (course: Course) => boolean;
  removeFromComparison: (courseId: string) => void;
  clearComparison: () => void;
  isInComparison: (courseId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonCourses, setComparisonCourses] = useState<Course[]>([]);

  const addToComparison = useCallback((course: Course): boolean => {
    if (comparisonCourses.length >= 2) {
      return false;
    }
    if (comparisonCourses.find(c => c.id === course.id)) {
      return false;
    }
    setComparisonCourses(prev => [...prev, course]);
    return true;
  }, [comparisonCourses]);

  const removeFromComparison = useCallback((courseId: string) => {
    setComparisonCourses(prev => prev.filter(c => c.id !== courseId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonCourses([]);
  }, []);

  const isInComparison = useCallback((courseId: string): boolean => {
    return comparisonCourses.some(c => c.id === courseId);
  }, [comparisonCourses]);

  return (
    <ComparisonContext.Provider 
      value={{ 
        comparisonCourses, 
        addToComparison, 
        removeFromComparison, 
        clearComparison,
        isInComparison 
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparisonContext() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparisonContext must be used within a ComparisonProvider');
  }
  return context;
}
