import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, getSessionCookieOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { password } = body;
  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  if (!validateAdminPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  const cookieOpts = getSessionCookieOptions();
  response.cookies.set(cookieOpts);
  return response;
}
