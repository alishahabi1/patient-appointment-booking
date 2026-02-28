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
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-red-600 hover:underline"
    >
      Logout
    </button>
  );
}
