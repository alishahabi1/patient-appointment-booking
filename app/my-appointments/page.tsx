import { PatientLookupForm } from '@/components/PatientLookupForm';

export const metadata = {
  title: 'My Appointments — MediBook',
};

export default function MyAppointmentsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Your Schedule
          </span>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">My Appointments</h1>
          <p className="text-slate-500 text-lg">Enter your phone number to view your upcoming visits.</p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <PatientLookupForm />
        </div>
      </div>
    </div>
  );
}
