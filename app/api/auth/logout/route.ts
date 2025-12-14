// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Call the backend logout API
    const backendResponse = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookie handling
    });

    if (backendResponse.ok) {
      // Clear cookies on client side
      const response = NextResponse.json({ 
        success: true,
        message: 'Logged out successfully'
      });
      
      // Clear cookies by setting them with expired date
      response.cookies.set('token', '', { 
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        sameSite: 'lax'
      });
      
      response.cookies.set('user', '', { 
        expires: new Date(0),
        path: '/',
        sameSite: 'lax'
      });
      
      return response;
    } else {
      throw new Error('Backend logout failed');
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}