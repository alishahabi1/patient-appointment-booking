import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getAllAppointments } from '@/lib/appointments';
import { AdminTable } from '@/components/AdminTable';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata = { title: 'Admin Dashboard — MediBook' };

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect('/admin/login');

  const appointments = getAllAppointments();

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = appointments.filter(a => a.appointment_dt.startsWith(today)).length;
  const upcomingCount = appointments.filter(a => a.appointment_dt >= new Date().toISOString()).length;
  const newPatients = appointments.filter(a => a.patient_type === 'new').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage all patient appointments</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              ← Booking form
            </a>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={appointments.length} color="blue" icon="📋" />
          <StatCard label="Today" value={todayCount} color="green" icon="📅" />
          <StatCard label="Upcoming" value={upcomingCount} color="violet" icon="⏰" />
          <StatCard label="New Patients" value={newPatients} color="amber" icon="👤" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">All Appointments</h2>
          </div>
          <div className="p-6">
            <AdminTable appointments={appointments} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
