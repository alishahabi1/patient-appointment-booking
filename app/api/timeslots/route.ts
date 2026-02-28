import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/timeslots';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Missing or invalid date parameter (expected YYYY-MM-DD)' },
      { status: 400 }
    );
  }

  const slots = getAvailableSlots(date);
  // Only return available slots to clients
  const available = slots.filter((s) => s.available);
  return NextResponse.json(available);
}
