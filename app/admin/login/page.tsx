import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminLoginForm } from '@/components/AdminLoginForm';

export const metadata = { title: 'Admin Login — MediBook' };

export default async function AdminLoginPage() {
  const authed = await isAdminAuthenticated();
  if (authed) redirect('/admin');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-md mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-1">Enter your password to continue</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <AdminLoginForm />
        </div>
        <p className="text-center mt-6 text-sm text-slate-500">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to booking</a>
        </p>
      </div>
    </div>
  );
}
