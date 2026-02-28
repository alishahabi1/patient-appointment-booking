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
        setAppointments(await res.json());
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
      <form onSubmit={handleLookup}>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              id="phone" label="Phone Number" type="tel"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 555-5555" error={error}
            />
          </div>
          <div className="pt-7">
            <Button type="submit" disabled={loading || !phone.trim()}>
              {loading ? 'Looking up…' : 'Find'}
            </Button>
          </div>
        </div>
      </form>

      {appointments !== null && (
        appointments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No appointments found</p>
            <p className="text-slate-400 text-sm mt-1">
              No appointments linked to <strong className="text-slate-600">{phone}</strong>.
            </p>
            <a href="/" className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Book an appointment →
            </a>
          </div>
        ) : (
          <AppointmentCalendar appointments={appointments} />
        )
      )}
    </div>
  );
}
