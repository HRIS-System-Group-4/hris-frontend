import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;

  // Kalau tidak ada token
  if (!token) {
    if (pathname.startsWith('/auth')) {
      return NextResponse.next();
    }
    // Kalau ke halaman lain, redirect ke login
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Kalau sudah ada token, dan mau ke halaman auth
  if (pathname.startsWith('/auth')) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Selain itu, lanjutkan
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/dashboard/:path*',
  ],
};
