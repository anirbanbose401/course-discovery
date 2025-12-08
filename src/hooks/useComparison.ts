'use client';

import { useComparisonContext } from '@/context/ComparisonContext';

export function useComparison() {
  return useComparisonContext();
}
