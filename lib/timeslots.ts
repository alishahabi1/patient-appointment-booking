import { getBookedSlotsForDate } from '@/lib/appointments';
import type { TimeSlot } from '@/lib/types';

const SLOT_DURATION_MINUTES = 30;
const START_HOUR = 9;   // 9:00 AM
const END_HOUR = 16;    // last slot starts at 4:30 PM (16:30)
const END_MINUTE = 30;

function generateAllSlots(date: string): string[] {
  // Returns ISO datetime strings for all possible slots on the given date
  const slots: string[] = [];
  let hour = START_HOUR;
  let minute = 0;

  while (
    hour < END_HOUR ||
    (hour === END_HOUR && minute <= END_MINUTE)
  ) {
    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    slots.push(`${date}T${hh}:${mm}:00`);

    minute += SLOT_DURATION_MINUTES;
    if (minute >= 60) {
      minute -= 60;
      hour += 1;
    }
  }

  return slots;
}

function isWeekday(date: string): boolean {
  const d = new Date(date + 'T12:00:00'); // use noon to avoid timezone issues
  const day = d.getDay(); // 0=Sun, 6=Sat
  return day !== 0 && day !== 6;
}

export function getAvailableSlots(date: string): TimeSlot[] {
  if (!isWeekday(date)) return [];

  const allSlots = generateAllSlots(date);
  const bookedSlots = new Set(getBookedSlotsForDate(date));

  return allSlots.map((datetime) => {
    const timePart = datetime.slice(11, 16); // "HH:MM"
    return {
      time: timePart,
      datetime,
      available: !bookedSlots.has(datetime),
    };
  });
}
