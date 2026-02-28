import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';
const SESSION_VALUE = 'authenticated';

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === SESSION_VALUE;
}

export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

export function getSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: SESSION_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  };
}
