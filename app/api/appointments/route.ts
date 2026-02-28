import { NextRequest, NextResponse } from 'next/server';
import { getAllAppointments, createAppointment } from '@/lib/appointments';
import { isAdminAuthenticated } from '@/lib/auth';
import type { AppointmentInput } from '@/lib/types';

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const appointments = getAllAppointments();
  return NextResponse.json(appointments);
}

export async function POST(request: NextRequest) {
  let body: AppointmentInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { patient_type, first_name, last_name, phone, reason, appointment_dt } = body;

  if (!patient_type || !first_name || !last_name || !phone || !reason || !appointment_dt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!['new', 'existing'].includes(patient_type)) {
    return NextResponse.json({ error: 'Invalid patient_type' }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(appointment_dt)) {
    return NextResponse.json({ error: 'Invalid appointment_dt format' }, { status: 400 });
  }

  try {
    const appointment = createAppointment(body);
    return NextResponse.json(appointment, { status: 201 });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes('UNIQUE constraint failed')
    ) {
      return NextResponse.json(
        { error: 'This time slot is no longer available. Please choose another.' },
        { status: 409 }
      );
    }
    console.error('Error creating appointment:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
