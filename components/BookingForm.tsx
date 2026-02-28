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
  return new Date(dt).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

const steps = [
  { n: 1, label: 'Patient Info', icon: '👤' },
  { n: 2, label: 'Date & Time', icon: '📅' },
  { n: 3, label: 'Confirm', icon: '✓' },
];

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
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">You&apos;re all set!</h2>
        <p className="text-slate-600 mb-1 font-medium">{form.first_name} {form.last_name}</p>
        <p className="text-blue-600 font-semibold">{formatDateTime(form.appointment_dt)}</p>
        <p className="text-slate-400 text-sm mt-4">
          View your appointment at{' '}
          <a href="/my-appointments" className="text-blue-600 hover:underline font-medium">My Appointments</a>
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => { setForm(initialForm); setStep(1); setSuccess(false); }}>
          Book Another Appointment
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                ${step > s.n ? 'bg-blue-600 border-blue-600 text-white' :
                  step === s.n ? 'bg-white border-blue-600 text-blue-600' :
                  'bg-white border-slate-200 text-slate-400'}`}>
                {step > s.n ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : s.n}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step === s.n ? 'text-blue-600' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-12px] rounded ${step > s.n ? 'bg-blue-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-0.5">Patient Information</h2>
            <p className="text-sm text-slate-500">Fields marked with * are required.</p>
          </div>

          <Select
            id="patient_type"
            label="Patient Type *"
            value={form.patient_type}
            onChange={(e) => updateField('patient_type', e.target.value as 'new' | 'existing')}
            options={[
              { value: 'new', label: 'New Patient' },
              { value: 'existing', label: 'Existing Patient' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input id="first_name" label="First Name *" value={form.first_name}
              onChange={(e) => updateField('first_name', e.target.value)}
              error={errors.first_name} placeholder="Jane" />
            <Input id="last_name" label="Last Name *" value={form.last_name}
              onChange={(e) => updateField('last_name', e.target.value)}
              error={errors.last_name} placeholder="Doe" />
          </div>

          <Input id="phone" label="Phone Number *" type="tel" value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            error={errors.phone} placeholder="(555) 555-5555" />

          <Input id="email" label="Email Address" type="email" value={form.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="jane@example.com" />

          <div className="grid grid-cols-2 gap-4">
            <Input id="insurance_provider" label="Insurance Provider" value={form.insurance_provider || ''}
              onChange={(e) => updateField('insurance_provider', e.target.value)}
              placeholder="e.g. BlueCross" />
            <Input id="insurance_id" label="Insurance ID" value={form.insurance_id || ''}
              onChange={(e) => updateField('insurance_id', e.target.value)}
              placeholder="e.g. XYZ123" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reason" className="text-sm font-medium text-slate-700">Reason for Visit *</label>
            <textarea
              id="reason" value={form.reason}
              onChange={(e) => updateField('reason', e.target.value)}
              rows={3} placeholder="Brief description of your visit..."
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                ${errors.reason ? 'border-red-400' : 'border-slate-300 hover:border-slate-400'}`}
            />
            {errors.reason && <p className="text-xs text-red-600">{errors.reason}</p>}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => validateStep1() && setStep(2)}>
              Next: Choose Date & Time →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-0.5">Choose Date & Time</h2>
            <p className="text-sm text-slate-500">Available Monday – Friday, 9 AM – 4:30 PM.</p>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {submitError}
            </div>
          )}

          <DateTimePicker value={form.appointment_dt} onChange={(dt) => { updateField('appointment_dt', dt); setSubmitError(''); }} />

          {errors.appointment_dt && <p className="text-sm text-red-600">{errors.appointment_dt}</p>}

          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
            <Button onClick={() => validateStep2() && setStep(3)}>Next: Review →</Button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-0.5">Confirm Your Appointment</h2>
            <p className="text-sm text-slate-500">Please review your details before confirming.</p>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {submitError}
            </div>
          )}

          {/* Appointment time highlight */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">Appointment Time</p>
            <p className="text-blue-800 font-bold text-lg">{formatDateTime(form.appointment_dt)}</p>
          </div>

          {/* Details */}
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {[
              { label: 'Patient Type', value: `${form.patient_type === 'new' ? 'New' : 'Existing'} Patient` },
              { label: 'Name', value: `${form.first_name} ${form.last_name}` },
              { label: 'Phone', value: form.phone },
              ...(form.email ? [{ label: 'Email', value: form.email }] : []),
              ...(form.insurance_provider ? [{ label: 'Insurance', value: `${form.insurance_provider}${form.insurance_id ? ` (${form.insurance_id})` : ''}` }] : []),
              { label: 'Reason', value: form.reason },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 px-4 py-3 text-sm">
                <span className="text-slate-500 w-28 shrink-0">{label}</span>
                <span className="text-slate-800 font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={() => setStep(2)}>← Back</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Confirming…' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
