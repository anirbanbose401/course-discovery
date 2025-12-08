import { NextRequest, NextResponse } from 'next/server';
import { Enrollment } from '@/types';



export async function GET(request: NextRequest) {
  try {

    return NextResponse.json({ enrollments: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();


    const requiredFields = [
      'courseId', 'courseName', 'courseCode', 'fullName', 'email',
      'phone', 'dateOfBirth', 'qualification', 'joinReason', 'source', 'agreedToTerms'
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }


    const enrollment: Enrollment = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      courseId: body.courseId,
      courseName: body.courseName,
      courseCode: body.courseCode,
      studentName: body.fullName,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      qualification: body.qualification,
      joinReason: body.joinReason,
      source: body.source,
      agreedToTerms: body.agreedToTerms,
      enrolledDate: new Date().toISOString(),
    };



    return NextResponse.json({ success: true, enrollment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 });
  }
}
