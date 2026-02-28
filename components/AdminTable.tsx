'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Appointment } from '@/lib/types';

interface AdminTableProps {
  appointments: Appointment[];
}

type SortKey = keyof Appointment;
type SortDir = 'asc' | 'desc';

function formatDt(dt: string) {
  return new Date(dt).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function AdminTable({ appointments: initial }: AdminTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initial);
  const [sortKey, setSortKey] = useState<SortKey>('appointment_dt');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [deleting, setDeleting] = useState<number | null>(null);

  function sort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const sorted = [...appointments].sort((a, b) => {
    const av = String(a[sortKey] ?? '');
    const bv = String(b[sortKey] ?? '');
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  async function handleDelete(id: number) {
    if (!confirm('Cancel this appointment?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) setAppointments(prev => prev.filter(a => a.id !== id));
      else alert('Failed to cancel appointment');
    } catch { alert('Network error'); }
    finally { setDeleting(null); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <span className="ml-1 text-slate-300">↕</span>;
    return <span className="ml-1 text-blue-500">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  function Th({ label, k }: { label: string; k: SortKey }) {
    return (
      <th onClick={() => sort(k)}
        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-700 whitespace-nowrap">
        {label}<SortIcon k={k} />
      </th>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 rounded-full mb-4">
          <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">No appointments yet</p>
        <p className="text-slate-400 text-sm mt-1">Appointments will appear here once booked.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <Th label="Date & Time" k="appointment_dt" />
            <Th label="Patient" k="last_name" />
            <Th label="Type" k="patient_type" />
            <Th label="Phone" k="phone" />
            <Th label="Reason" k="reason" />
            <Th label="Insurance" k="insurance_provider" />
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {sorted.map((appt) => (
            <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-blue-700">
                {formatDt(appt.appointment_dt)}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-800">
                {appt.first_name} {appt.last_name}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold
                  ${appt.patient_type === 'new' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                  {appt.patient_type === 'new' ? 'New' : 'Existing'}
                </span>
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">{appt.phone}</td>
              <td className="px-4 py-3.5 max-w-xs truncate text-slate-600" title={appt.reason}>{appt.reason}</td>
              <td className="px-4 py-3.5 whitespace-nowrap text-slate-400">
                {appt.insurance_provider || '—'}
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <Button variant="danger" size="sm"
                  onClick={() => handleDelete(appt.id)}
                  disabled={deleting === appt.id}>
                  {deleting === appt.id ? '…' : 'Cancel'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
