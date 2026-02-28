'use client';

import { useState } from 'react';
import { DateTimePicker } from '@/components/DateTimePicker';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { AppointmentInput } from '@/lib/types';

type Step = 1 | 2 | 3;

const initialForm: AppointmentInput = {
  patient_type: 'new',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  insurance_provider: '',
  insurance_id: '',
  reason: '',
  appointment_dt: '',
};

function formatDateTime(dt: string) {
  if (!dt) return '';
  const date = new Date(dt);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function BookingForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<AppointmentInput>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  function updateField<K extends keyof AppointmentInput>(key: K, value: AppointmentInput[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validateStep1() {
    const errs: Partial<Record<keyof AppointmentInput, string>> = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.reason.trim()) errs.reason = 'Reason for visit is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep2() {
    if (!form.appointment_dt) {
      setErrors(e => ({ ...e, appointment_dt: 'Please select a date and time' }));
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
      } else if (res.status === 409) {
        const data = await res.json();
        setSubmitError(data.error || 'This slot is no longer available. Please go back and choose another.');
        setStep(2);
        updateField('appointment_dt', '');
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Appointment Booked!</h2>
        <p className="text-gray-600 mb-1">
          {form.first_name} {form.last_name} — {formatDateTime(form.appointment_dt)}
        </p>
        <p className="text-gray-500 text-sm mt-4">
          You can view your appointments at{' '}
          <a href="/my-appointments" className="text-blue-600 underline">/my-appointments</a>
        </p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => { setForm(initialForm); setStep(1); setSuccess(false); }}
        >
          Book Another Appointment
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {s}
            </div>
            {s < 3 && (
              <div className={`h-1 w-16 mx-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
        <div className="ml-4 text-sm text-gray-500">
          {step === 1 ? 'Patient Info' : step === 2 ? 'Date & Time' : 'Confirm'}
        </div>
      </div>

      {/* Step 1: Patient Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Patient Information</h2>
          <Select
            id="patient_type"
            label="Patient Type"
            value={form.patient_type}
            onChange={(e) => updateField('patient_type', e.target.value as 'new' | 'existing')}
            options={[
              { value: 'new', label: 'New Patient' },
              { value: 'existing', label: 'Existing Patient' },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="first_name"
              label="First Name *"
              value={form.first_name}
              onChange={(e) => updateField('first_name', e.target.value)}
              error={errors.first_name}
              placeholder="Jane"
            />
            <Input
              id="last_name"
              label="Last Name *"
              value={form.last_name}
              onChange={(e) => updateField('last_name', e.target.value)}
              error={errors.last_name}
              placeholder="Doe"
            />
          </div>
          <Input
            id="phone"
            label="Phone Number *"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            error={errors.phone}
            placeholder="(555) 555-5555"
          />
          <Input
            id="email"
            label="Email (optional)"
            type="email"
            value={form.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="jane@example.com"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="insurance_provider"
              label="Insurance Provider"
              value={form.insurance_provider || ''}
              onChange={(e) => updateField('insurance_provider', e.target.value)}
              placeholder="e.g. BlueCross"
            />
            <Input
              id="insurance_id"
              label="Insurance ID"
              value={form.insurance_id || ''}
              onChange={(e) => updateField('insurance_id', e.target.value)}
              placeholder="e.g. XYZ123"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="reason" className="text-sm font-medium text-gray-700">
              Reason for Visit *
            </label>
            <textarea
              id="reason"
              value={form.reason}
              onChange={(e) => updateField('reason', e.target.value)}
              rows={3}
              placeholder="Brief description of your visit..."
              className={`border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.reason ? 'border-red-400' : ''}`}
            />
            {errors.reason && <p className="text-xs text-red-600">{errors.reason}</p>}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={() => validateStep1() && setStep(2)}>Next: Choose Date & Time</Button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Choose Date & Time</h2>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-sm">
              {submitError}
            </div>
          )}
          <DateTimePicker
            value={form.appointment_dt}
            onChange={(dt) => {
              updateField('appointment_dt', dt);
              setSubmitError('');
            }}
          />
          {errors.appointment_dt && (
            <p className="text-sm text-red-600">{errors.appointment_dt}</p>
          )}
          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => validateStep2() && setStep(3)}>Next: Review</Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Confirm Appointment</h2>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-sm">
              {submitError}
            </div>
          )}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-gray-500">Patient Type</span>
              <span className="capitalize">{form.patient_type} Patient</span>
              <span className="text-gray-500">Name</span>
              <span>{form.first_name} {form.last_name}</span>
              <span className="text-gray-500">Phone</span>
              <span>{form.phone}</span>
              {form.email && <>
                <span className="text-gray-500">Email</span>
                <span>{form.email}</span>
              </>}
              {form.insurance_provider && <>
                <span className="text-gray-500">Insurance</span>
                <span>{form.insurance_provider}</span>
              </>}
              {form.insurance_id && <>
                <span className="text-gray-500">Insurance ID</span>
                <span>{form.insurance_id}</span>
              </>}
              <span className="text-gray-500">Reason</span>
              <span>{form.reason}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-500">Appointment</span>
              <p className="font-semibold text-blue-700 mt-0.5">{formatDateTime(form.appointment_dt)}</p>
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
