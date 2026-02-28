import { NextRequest, NextResponse } from 'next/server';
import { getAppointmentsByPhone } from '@/lib/appointments';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone || phone.trim().length < 7) {
    return NextResponse.json(
      { error: 'Missing or invalid phone number' },
      { status: 400 }
    );
  }

  const appointments = getAppointmentsByPhone(phone.trim());
  return NextResponse.json(appointments);
}
