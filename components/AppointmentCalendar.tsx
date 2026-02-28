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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function formatDt(dt: string) {
  return new Date(dt).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
        </h3>
        <p className="text-xs text-slate-400">Click a highlighted date to see details</p>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 px-4 py-3">
          <button type="button" onClick={prevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold text-slate-800">{monthNames[month]} {year}</span>
          <button type="button" onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 text-center mb-2">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} className="text-xs font-semibold text-slate-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = toLocalISODate(new Date(year, month, day));
              const hasAppt = !!apptMap[dateStr];
              const isSelected = dateStr === selected;
              const isToday = dateStr === toLocalISODate(today);
              return (
                <div key={day} className="relative flex flex-col items-center">
                  <button type="button"
                    onClick={() => hasAppt && setSelected(isSelected ? null : dateStr)}
                    className={`
                      mx-auto w-9 h-9 rounded-lg text-sm font-medium transition-all
                      ${isSelected ? 'bg-blue-600 text-white shadow-sm' : ''}
                      ${hasAppt && !isSelected ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer font-semibold' : ''}
                      ${!hasAppt ? 'text-slate-400 cursor-default' : ''}
                      ${isToday && !isSelected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
                    `}
                  >
                    {day}
                  </button>
                  {hasAppt && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selected && selectedAppts.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-800">
            {new Date(selected + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h4>
          {selectedAppts.map(appt => (
            <div key={appt.id} className="border border-blue-200 bg-blue-50 rounded-xl p-4 space-y-2 text-sm">
              <p className="font-bold text-blue-800 text-base">{formatDt(appt.appointment_dt)}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                <span className="text-slate-400">Name</span>
                <span className="font-medium text-slate-700">{appt.first_name} {appt.last_name}</span>
                <span className="text-slate-400">Reason</span>
                <span className="font-medium text-slate-700">{appt.reason}</span>
                {appt.insurance_provider && <>
                  <span className="text-slate-400">Insurance</span>
                  <span className="font-medium text-slate-700">{appt.insurance_provider}{appt.insurance_id ? ` (${appt.insurance_id})` : ''}</span>
                </>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
