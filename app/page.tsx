import { BookingForm } from '@/components/BookingForm';

export const metadata = {
  title: 'Book an Appointment — MediBook',
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Online Booking
          </span>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Book Your Appointment
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Schedule your visit in minutes. Available Monday – Friday, 9 AM to 4:30 PM.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
