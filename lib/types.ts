export interface Appointment {
  id: number;
  patient_type: 'new' | 'existing';
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  insurance_provider?: string;
  insurance_id?: string;
  reason: string;
  appointment_dt: string; // ISO 8601: "2026-03-15T10:30:00"
  created_at: string;
}

export interface AppointmentInput {
  patient_type: 'new' | 'existing';
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  insurance_provider?: string;
  insurance_id?: string;
  reason: string;
  appointment_dt: string;
}

export interface TimeSlot {
  time: string;     // "10:30"
  datetime: string; // "2026-03-15T10:30:00"
  available: boolean;
}
