import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllAppointments } from '@/lib/appointments';
import { AdminTable } from '@/components/AdminTable';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata = {
  title: 'Admin Dashboard',
};

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect('/admin/login');

  const appointments = getAllAppointments();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <a href="/" className="text-sm text-blue-600 hover:underline">Booking Form</a>
            <LogoutButton />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <AdminTable appointments={appointments} />
        </div>
      </div>
    </main>
  );
}
