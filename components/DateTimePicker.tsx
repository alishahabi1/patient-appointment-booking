'use client';

import { useState, useEffect } from 'react';
import type { TimeSlot } from '@/lib/types';

interface DateTimePickerProps {
  value: string;
  onChange: (datetime: string) => void;
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

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    setError('');
    setSlots([]);
    fetch(`/api/timeslots?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setSlots(data) : setError('Failed to load slots'))
      .catch(() => setError('Failed to load slots'))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDate('');
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDate('');
  }

  function selectDay(day: number) {
    const d = new Date(year, month, day);
    const todayStr = toLocalISODate(today);
    const dateStr = toLocalISODate(d);
    if (dateStr < todayStr || d.getDay() === 0 || d.getDay() === 6) return;
    setSelectedDate(dateStr);
    onChange('');
  }

  const selectedSlotDt = value?.startsWith(selectedDate) ? value : '';

  return (
    <div className="space-y-5">
      {/* Calendar */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {/* Month header */}
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
          {/* Day headers */}
          <div className="grid grid-cols-7 text-center mb-2">
            {dayNames.map(d => (
              <div key={d} className="text-xs font-semibold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const d = new Date(year, month, day);
              const dateStr = toLocalISODate(d);
              const todayStr = toLocalISODate(today);
              const isPast = dateStr < todayStr;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === todayStr;
              const disabled = isPast || isWeekend;
              return (
                <button type="button" key={day}
                  onClick={() => !disabled && selectDay(day)}
                  disabled={disabled}
                  className={`
                    mx-auto w-9 h-9 rounded-lg text-sm font-medium transition-all
                    ${disabled ? 'text-slate-300 cursor-not-allowed' : 'cursor-pointer'}
                    ${isSelected ? 'bg-blue-600 text-white shadow-sm' : ''}
                    ${!isSelected && !disabled ? 'hover:bg-blue-50 hover:text-blue-700 text-slate-700' : ''}
                    ${isToday && !isSelected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Available times — {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
              <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Loading available times…
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && slots.length === 0 && (
            <p className="text-sm text-slate-500 py-4 text-center bg-slate-50 rounded-lg">No available slots for this day.</p>
          )}
          {!loading && slots.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {slots.map(slot => (
                <button type="button" key={slot.datetime} onClick={() => onChange(slot.datetime)}
                  className={`
                    py-2.5 px-2 text-sm font-medium rounded-lg border transition-all
                    ${selectedSlotDt === slot.datetime
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 text-slate-700 bg-white'}
                  `}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
