import { BookingForm } from '@/components/BookingForm';

export const metadata = {
  title: 'Book an Appointment',
  description: 'Schedule your medical appointment online.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
          <p className="text-gray-500">Fill out the form below to schedule your visit.</p>
          <div className="mt-3 flex justify-center gap-4 text-sm">
            <a href="/my-appointments" className="text-blue-600 hover:underline">View My Appointments</a>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <BookingForm />
        </div>
      </div>
    </main>
  );
}
