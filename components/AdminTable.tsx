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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function AdminTable({ appointments: initial }: AdminTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initial);
  const [sortKey, setSortKey] = useState<SortKey>('appointment_dt');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [deleting, setDeleting] = useState<number | null>(null);

  function sort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = [...appointments].sort((a, b) => {
    const av = String(a[sortKey] ?? '');
    const bv = String(b[sortKey] ?? '');
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAppointments(prev => prev.filter(a => a.id !== id));
      } else {
        alert('Failed to delete appointment');
      }
    } catch {
      alert('Network error');
    } finally {
      setDeleting(null);
    }
  }

  function Th({ label, k }: { label: string; k: SortKey }) {
    return (
      <th
        onClick={() => sort(k)}
        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none whitespace-nowrap"
      >
        {label}
        {sortKey === k && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </th>
    );
  }

  if (appointments.length === 0) {
    return <p className="text-gray-500 text-center py-12">No appointments yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <Th label="Date & Time" k="appointment_dt" />
            <Th label="Name" k="last_name" />
            <Th label="Type" k="patient_type" />
            <Th label="Phone" k="phone" />
            <Th label="Reason" k="reason" />
            <Th label="Insurance" k="insurance_provider" />
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sorted.map((appt) => (
            <tr key={appt.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-blue-700 font-medium">
                {formatDt(appt.appointment_dt)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {appt.first_name} {appt.last_name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  appt.patient_type === 'new'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {appt.patient_type}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{appt.phone}</td>
              <td className="px-4 py-3 max-w-xs truncate" title={appt.reason}>{appt.reason}</td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                {appt.insurance_provider || '—'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(appt.id)}
                  disabled={deleting === appt.id}
                  className="text-xs py-1 px-2"
                >
                  {deleting === appt.id ? '...' : 'Cancel'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
