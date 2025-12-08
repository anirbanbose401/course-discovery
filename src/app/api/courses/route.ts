import { NextRequest, NextResponse } from 'next/server';
import coursesData from '@/data/courses.json';
import { Course } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const level = searchParams.get('level') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '12');

    let filtered = [...coursesData] as Course[];

    // Search filter (searches in course name and instructor name)
    if (search) {
      const searchLower = search.toLowerCase();
      // Basic search: check if query exists in title OR instructor name
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.instructor.name.toLowerCase().includes(searchLower)
      );
    }


    if (department) {
      filtered = filtered.filter((course) => course.department === department);
    }


    if (level) {
      const levels = level.split(',');
      filtered = filtered.filter((course) => levels.includes(course.level));
    }


    if (minPrice) {
      filtered = filtered.filter((course) => course.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((course) => course.price <= parseInt(maxPrice));
    }


    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
      }
    }


    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedCourses = filtered.slice(start, end);

    return NextResponse.json({
      courses: paginatedCourses,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
