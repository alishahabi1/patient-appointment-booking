import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminLoginForm } from '@/components/AdminLoginForm';

export const metadata = {
  title: 'Admin Login',
};

export default async function AdminLoginPage() {
  const authed = await isAdminAuthenticated();
  if (authed) redirect('/admin');

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your admin password to continue.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <AdminLoginForm />
        </div>
        <p className="text-center mt-4 text-sm">
          <a href="/" className="text-blue-600 hover:underline">← Back to booking</a>
        </p>
      </div>
    </main>
  );
}
