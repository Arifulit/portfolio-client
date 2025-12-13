// // middleware.ts (Final Correct & Recommended Version – 2025 Best Practice)

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   // টোকেন চেক করো (cookie থেকে (তুমি যেভাবে দিচ্ছো সেটাই ঠিক আছে)
//   const token = request.cookies.get('token')?.value;

//   const { pathname } = request.nextUrl;

//   // ১. Dashboard (এবং তার সাব-পাথ) প্রটেক্ট করো
//   if (pathname.startsWith('/dashboard')) {
//     if (!token) {
//       // টোকেন নেই → লগইন পেজে পাঠাও
//       const loginUrl = new URL('/login', request.url);
//       loginUrl.searchParams.set('redirect', pathname); // লগইনের পর ফিরে আসার জন্য (অপশনাল)
//       return NextResponse.redirect(loginUrl);
//     }
//     // টোকেন আছে → ঢুকতে দাও
//     return NextResponse.next();
//   }

//   // ২. লগইন পেজে যদি টোকেন থাকে তাহলে ড্যাশবোর্ডে পাঠাও
//   //     (যাতে logged in user login page না দেখে)
//   if (pathname === '/login' && token) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   // বাকি সব রুট (home, blogs, projects, about ইত্যাদি) → সবাই দেখতে পারবে
//   return NextResponse.next();
// }

// // কোন রুটগুলোতে middleware চলবে
// export const config = {
//   matcher: [
//     '/dashboard/:path*',  // dashboard এবং তার সব sub-page
//     '/login',             // login page
//   ],
// };


// middleware.ts (Recommended & Safe Version – No Redirect from Login Page)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Token চেক করো (তোমার cookie নাম 'token')
  const token = request.cookies.get('token')?.value;

  const { pathname } = request.nextUrl;

  // শুধু dashboard (এবং তার sub-pages) protect করো
  if (pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url);
    // অপশনাল: login পর কোথায় ফিরে যাবে
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // বাকি সব রুট allow করো (login page যেতে দাও, token থাকলেও)
  return NextResponse.next();
}

// Middleware শুধু এই রুটগুলোতে চলবে
export const config = {
  matcher: '/dashboard/:path*',  // শুধু dashboard protect করো, /login remove করো
};