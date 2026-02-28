import getDb from '@/lib/db';
import type { Appointment, AppointmentInput } from '@/lib/types';

export function getAllAppointments(): Appointment[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM appointments ORDER BY appointment_dt ASC')
    .all() as Appointment[];
}

export function getAppointmentsByPhone(phone: string): Appointment[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM appointments WHERE phone = ? ORDER BY appointment_dt ASC')
    .all(phone) as Appointment[];
}

export function getBookedSlotsForDate(date: string): string[] {
  const db = getDb();
  // date format: "YYYY-MM-DD"
  const rows = db
    .prepare("SELECT appointment_dt FROM appointments WHERE appointment_dt LIKE ?")
    .all(`${date}%`) as { appointment_dt: string }[];
  return rows.map((r) => r.appointment_dt);
}

export function createAppointment(input: AppointmentInput): Appointment {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO appointments
      (patient_type, first_name, last_name, phone, email, insurance_provider, insurance_id, reason, appointment_dt)
    VALUES
      (@patient_type, @first_name, @last_name, @phone, @email, @insurance_provider, @insurance_id, @reason, @appointment_dt)
  `);
  const params = {
    patient_type: input.patient_type,
    first_name: input.first_name,
    last_name: input.last_name,
    phone: input.phone,
    email: input.email ?? null,
    insurance_provider: input.insurance_provider ?? null,
    insurance_id: input.insurance_id ?? null,
    reason: input.reason,
    appointment_dt: input.appointment_dt,
  };
  const result = stmt.run(params);
  return db
    .prepare('SELECT * FROM appointments WHERE id = ?')
    .get(result.lastInsertRowid) as Appointment;
}

export function deleteAppointment(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM appointments WHERE id = ?').run(id);
  return result.changes > 0;
}
