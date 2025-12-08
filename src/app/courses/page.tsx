'use client';

import React, { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CourseCard from '@/components/courses/CourseCard';
import FilterSidebar from '@/components/courses/CourseFilterSidebar';
import SearchBar from '@/components/courses/CourseSearch';
import Pagination from '@/components/ui/Pagination';
import ComparisonModal from '@/components/courses/CourseComparisonModal';
import { Button } from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { SkeletonList } from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import { Course, FilterState } from '@/types';
import { useComparison } from '@/hooks/useComparison';
import { Filter } from 'lucide-react';

const COURSES_PER_PAGE = 12;

function CoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { comparisonCourses } = useComparison();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const currentPage = Number(searchParams.get('page')) || 1;
  const [totalPages, setTotalPages] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);


  // We keep track of the first fetch to avoid showing the loading spinner unnecessarily on subsequent filter changes
  const hasFetched = useRef(false);

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    department: searchParams.get('department') || '',
    level: searchParams.get('level') ? searchParams.get('level')!.split(',') : [],
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || '',
  });


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        if (response.ok) {
          const data = await response.json();
          setDepartments(data.map((d: { name: string }) => d.name));
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };

    // Just a one-time fetch for the filter dropdown options
    fetchDepartments();
  }, []);


  useEffect(() => {
    const fetchCourses = async () => {

      if (hasFetched.current) {
        // Show a lighter loading state when just updating filters
        setFiltering(true);
      }

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          perPage: COURSES_PER_PAGE.toString(),
        });

        if (filters.search) params.set('search', filters.search);
        if (filters.department) params.set('department', filters.department);
        if (filters.level.length > 0) params.set('level', filters.level.join(','));
        if (filters.minPrice) params.set('minPrice', filters.minPrice);
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
        if (filters.sortBy) params.set('sortBy', filters.sortBy);

        const response = await fetch(`/api/courses?${params}`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
          setTotalPages(data.pagination.totalPages);
          setTotalCourses(data.pagination.total);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setFiltering(false);
        setLoading(false);
        hasFetched.current = true;
      }
    };

    fetchCourses();
  }, [currentPage, filters]);

  const updateQueryParams = useCallback((newFilters: FilterState, page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());

    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.department) params.set('department', newFilters.department);
    if (newFilters.level.length > 0) params.set('level', newFilters.level.join(','));
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);

    // Update the URL without a hard reload so it's shareable
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    updateQueryParams(newFilters, 1);
  }, [updateQueryParams]);

  const handleClearFilters = useCallback(() => {
    const emptyFilters = {
      search: '',
      department: '',
      level: [],
      minPrice: '',
      maxPrice: '',
      sortBy: '',
    };
    setFilters(emptyFilters);
    updateQueryParams(emptyFilters, 1);
  }, [updateQueryParams]);

  const handlePageChange = useCallback((page: number) => {
    updateQueryParams(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, updateQueryParams]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Find the perfect course to advance your career
          </p>


          <SearchBar
            onSearch={useCallback((query: string) => {
              if (filters.search === query) return;
              handleFilterChange({ ...filters, search: query });
            }, [filters, handleFilterChange])}
            placeholder="Search by course name or instructor..."
            initialValue={filters.search}
            sortBy={filters.sortBy}
            onSortChange={(sort) => handleFilterChange({ ...filters, sortBy: sort })}
          />
        </div>


        {comparisonCourses.length > 0 && (
          <div className="mb-6">
            <Button onClick={() => setShowComparison(true)}>
              Compare Courses ({comparisonCourses.length})
            </Button>
          </div>
        )}


        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Show Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              departments={departments}
              onClearFilters={handleClearFilters}
              totalCourses={totalCourses}
              currentPage={currentPage}
              coursesPerPage={COURSES_PER_PAGE}
              loading={loading}
            />
          </div>


          <div className="lg:col-span-3">

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <SkeletonList count={12} />
              </div>
            )}


            {!loading && filtering && (
              <div className="relative">
                <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10" aria-busy="true" aria-label="Loading courses">
                  <Spinner size="lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-50">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} showComparison />
                  ))}
                </div>
              </div>
            )}


            {!loading && !filtering && (
              <>
                {courses.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-xl text-gray-600 mb-4">No courses found</p>
                    <p className="text-gray-500 mb-8">Try adjusting your filters</p>
                    <Button onClick={handleClearFilters}>Clear Filters</Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {courses.map((course) => (
                        <CourseCard key={course.id} course={course} showComparison />
                      ))}
                    </div>


                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>


      <ComparisonModal isOpen={showComparison} onClose={() => setShowComparison(false)} />


      <Modal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        title="Filters"
        size="lg"
      >
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          onClearFilters={handleClearFilters}
          totalCourses={totalCourses}
          currentPage={currentPage}
          coursesPerPage={COURSES_PER_PAGE}
          loading={loading}
          variant="embedded"
        />
        <div className="mt-6 pt-4 border-t sticky bottom-0 bg-white">
          <Button fullWidth onClick={() => setShowMobileFilters(false)}>
            Show Results
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <SkeletonList count={12} />
          </div>
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
