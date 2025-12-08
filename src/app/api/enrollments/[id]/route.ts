import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {


    return NextResponse.json({ success: true, message: 'Enrollment cancelled successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel enrollment' }, { status: 500 });
  }
}
