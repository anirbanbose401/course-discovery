import { NextRequest, NextResponse } from 'next/server';
import coursesData from '@/data/courses.json';
import { Course } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = (coursesData as Course[]).find((c) => c.id === id);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
