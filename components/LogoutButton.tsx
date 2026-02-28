'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout}
      className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
      Sign out
    </button>
  );
}
