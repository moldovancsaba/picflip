import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('ADMIN_TOKEN')?.value
    const envToken = process.env.ADMIN_TOKEN

    // If no token in cookies or doesn't match env token, redirect to login
    if (!token || token !== envToken) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}
