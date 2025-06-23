import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

// Paths that require authentication
const PROTECTED_PATHS = ['/admin', '/users', '/organizations', '/api/admin'];

// Paths that are only accessible when logged out
const AUTH_PATHS = ['/login'];

export async function middleware(request: NextRequest) {
  console.log(`Processing ${request.method} request to ${request.nextUrl.pathname}`);
  const session = await getSession(request);
  console.log('Session:', session);
  const { pathname } = request.nextUrl;

  // Check if path requires authentication
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isAuthPath = AUTH_PATHS.some(path => pathname === path);

  // Redirect authenticated users away from auth pages
  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users to login
  if (!session && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/api/:path*'
  ],
};
