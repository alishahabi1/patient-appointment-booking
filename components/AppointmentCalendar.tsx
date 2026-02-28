'use client';

import { useState } from 'react';
import type { Appointment } from '@/lib/types';

interface AppointmentCalendarProps {
  appointments: Appointment[];
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toLocalISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDt(dt: string) {
  return new Date(dt).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function AppointmentCalendar({ appointments }: AppointmentCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build a map: dateStr → appointments[]
  const apptMap: Record<string, Appointment[]> = {};
  for (const appt of appointments) {
    const dateStr = appt.appointment_dt.slice(0, 10);
    if (!apptMap[dateStr]) apptMap[dateStr] = [];
    apptMap[dateStr].push(appt);
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelected(null);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelected(null);
  }

  const selectedAppts = selected ? apptMap[selected] || [] : [];

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600">&#8249;</button>
          <span className="font-semibold text-gray-800">{monthNames[month]} {year}</span>
          <button type="button" onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600">&#8250;</button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-sm text-center">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = toLocalISODate(new Date(year, month, day));
            const hasAppt = !!apptMap[dateStr];
            const isSelected = dateStr === selected;
            const isToday = dateStr === toLocalISODate(today);
            return (
              <div key={day} className="relative flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => hasAppt && setSelected(isSelected ? null : dateStr)}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
                    ${hasAppt ? 'cursor-pointer' : 'cursor-default'}
                    ${isSelected ? 'bg-blue-600 text-white' : ''}
                    ${hasAppt && !isSelected ? 'hover:bg-blue-100' : ''}
                    ${isToday && !isSelected ? 'border border-blue-400 text-blue-600' : ''}
                  `}
                >
                  {day}
                </button>
                {hasAppt && (
                  <span className="absolute bottom-0 w-1 h-1 rounded-full bg-blue-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selected && selectedAppts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">
            Appointments on {new Date(selected + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          {selectedAppts.map((appt) => (
            <div key={appt.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-1 text-sm">
              <p className="font-semibold text-blue-800">{formatDt(appt.appointment_dt)}</p>
              <p className="text-gray-700"><span className="font-medium">Patient:</span> {appt.first_name} {appt.last_name}</p>
              <p className="text-gray-700"><span className="font-medium">Reason:</span> {appt.reason}</p>
              {appt.insurance_provider && (
                <p className="text-gray-700"><span className="font-medium">Insurance:</span> {appt.insurance_provider} {appt.insurance_id && `(${appt.insurance_id})`}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>Total appointments: <strong>{appointments.length}</strong></p>
        <p>Blue dots indicate days with appointments. Click a day to see details.</p>
      </div>
    </div>
  );
}
