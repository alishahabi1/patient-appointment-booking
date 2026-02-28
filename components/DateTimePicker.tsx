'use client';

import { useState, useEffect } from 'react';
import type { TimeSlot } from '@/lib/types';

interface DateTimePickerProps {
  value: string; // ISO datetime "YYYY-MM-DDTHH:MM:SS"
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
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSlots(data);
        else setError('Failed to load slots');
      })
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
    if (d < new Date(toLocalISODate(today))) return; // past
    const dow = d.getDay();
    if (dow === 0 || dow === 6) return; // weekend
    setSelectedDate(toLocalISODate(d));
    onChange('');
  }

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const selectedSlotDt = value && value.startsWith(selectedDate) ? value : '';

  return (
    <div className="space-y-4">
      {/* Calendar */}
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
            const d = new Date(year, month, day);
            const dateStr = toLocalISODate(d);
            const todayStr = toLocalISODate(today);
            const isPast = dateStr < todayStr;
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;
            const disabled = isPast || isWeekend;
            return (
              <button
                type="button"
                key={day}
                onClick={() => !disabled && selectDay(day)}
                disabled={disabled}
                className={`
                  w-8 h-8 mx-auto rounded-full text-sm transition-colors
                  ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-100 cursor-pointer'}
                  ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-600' : ''}
                  ${isToday && !isSelected ? 'border border-blue-400 text-blue-600' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Available times for {selectedDate}
          </p>
          {loading && <p className="text-sm text-gray-500">Loading slots...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && !error && slots.length === 0 && (
            <p className="text-sm text-gray-500">No available slots for this day.</p>
          )}
          {!loading && slots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  type="button"
                  key={slot.datetime}
                  onClick={() => onChange(slot.datetime)}
                  className={`
                    py-2 px-3 text-sm rounded-md border transition-colors
                    ${selectedSlotDt === slot.datetime
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700'}
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
