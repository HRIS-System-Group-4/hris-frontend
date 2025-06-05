// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log('request.url:', request.url);
    console.log('Middleware triggered for path:', pathname); // Harus muncul

    const authToken = request.cookies.get('auth_token')?.value;

    const protectedRoutes = ['/dashboard/:path*'];
    const authRoutes = ['/auth/:path*'];

    const isAuthenticated = !!authToken;
    console.log('isAuthenticated:', isAuthenticated);

    // if (protectedRoutes.some((route) => pathname.match(route) || pathname === route)) {
    //     if (!isAuthenticated) {
    //         console.log('Redirecting to /auth/login');
    //         return NextResponse.redirect(new URL('/auth/login', request.url));
    //     }
    // }

    // if (authRoutes.some((route) => pathname.match(route)) && isAuthenticated) {
    //     console.log('Redirecting to /dashboard');
    //     return NextResponse.redirect(new URL('/dashboard', request.url));
    // }
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isAuthRoute = pathname.startsWith('/auth');

    if (isProtectedRoute && !isAuthenticated) {
        console.log('Redirecting to /auth/login');
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (isAuthRoute && isAuthenticated) {
        console.log('Redirecting to /dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log('Redirecting to nothing');
    return NextResponse.next();
}

export const config = {
    matcher: ['/auth/:path*', '/dashboard/:path*'],
};