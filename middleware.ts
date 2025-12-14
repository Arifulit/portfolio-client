
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Token from cookie
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  // dashboard
  if (pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url);
   
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }


  return NextResponse.next();
}


export const config = {
  matcher: '/dashboard/:path*',   
};