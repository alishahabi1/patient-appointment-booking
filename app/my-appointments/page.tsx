import { PatientLookupForm } from '@/components/PatientLookupForm';

export const metadata = {
  title: 'My Appointments',
  description: 'View your upcoming appointments by phone number.',
};

export default function MyAppointmentsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-500">Enter your phone number to view your scheduled appointments.</p>
          <div className="mt-3 text-sm">
            <a href="/" className="text-blue-600 hover:underline">← Book a new appointment</a>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <PatientLookupForm />
        </div>
      </div>
    </main>
  );
}
