import { NextResponse } from 'next/server';
import coursesData from '@/data/courses.json';
import { Course } from '@/types';

export async function GET() {
  try {
    const featuredCourses = (coursesData as Course[]).filter((course) => course.isFeatured);

    return NextResponse.json(featuredCourses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch featured courses' }, { status: 500 });
  }
}
