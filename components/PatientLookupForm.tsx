'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AppointmentCalendar } from '@/components/AppointmentCalendar';
import type { Appointment } from '@/lib/types';

export function PatientLookupForm() {
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    setAppointments(null);
    try {
      const res = await fetch(`/api/my-appointments?phone=${encodeURIComponent(phone.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to look up appointments');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleLookup} className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            id="phone"
            label="Your Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 555-5555"
            error={error}
          />
        </div>
        <Button type="submit" disabled={loading || !phone.trim()}>
          {loading ? 'Looking up...' : 'Find Appointments'}
        </Button>
      </form>

      {appointments !== null && (
        appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No appointments found for <strong>{phone}</strong>.
            <a href="/" className="text-blue-600 underline ml-1">Book one now.</a>
          </p>
        ) : (
          <AppointmentCalendar appointments={appointments} />
        )
      )}
    </div>
  );
}
