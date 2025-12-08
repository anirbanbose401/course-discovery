import { NextResponse } from 'next/server';
import departmentsData from '@/data/departments.json';

export async function GET() {
  try {
    return NextResponse.json(departmentsData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}
