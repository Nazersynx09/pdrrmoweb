import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedUser,
  getAuthenticatedUserFromToken,
  isAdminEmail,
} from '../_auth';

function clearAdminCookie(response: NextResponse) {
  response.cookies.set('admin_access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 },
    );
  }

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : '';
  const user = token ? await getAuthenticatedUserFromToken(token) : null;
  if (!user) {
    const response = NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
    return clearAdminCookie(response);
  }

  if (!isAdminEmail(user.email)) {
    const response = NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 },
    );
    return clearAdminCookie(response);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });
  return response;
}

export async function DELETE() {
  return clearAdminCookie(NextResponse.json({ success: true }));
}
