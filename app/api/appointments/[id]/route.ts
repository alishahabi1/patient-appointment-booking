import { NextRequest, NextResponse } from 'next/server';
import { deleteAppointment } from '@/lib/appointments';
import { isAdminAuthenticated } from '@/lib/auth';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const deleted = deleteAppointment(numericId);
  if (!deleted) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
