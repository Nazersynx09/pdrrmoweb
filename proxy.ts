import { NextResponse, type NextRequest } from 'next/server';

const allowedAdminIps = new Set(
  (process.env.ADMIN_ALLOWED_IPS ?? '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean),
);

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  const clientIp = request.headers.get('x-real-ip')?.trim();
  if (clientIp && allowedAdminIps.has(clientIp)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/admin/')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ['/login', '/admin', '/admin/:path*', '/api/admin/:path*'],
};
