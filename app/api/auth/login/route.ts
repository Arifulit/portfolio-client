import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as LoginRequest;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call the backend API at localhost:5000
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000', // Add origin header
      },
      credentials: 'include', // Include credentials for cookie handling
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Invalid credentials' },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();

    // Debug: Log backend response headers
    console.log('Backend response headers:', Object.fromEntries(backendResponse.headers.entries()));
    console.log('Backend data:', backendData);

    // Create response and forward cookies from backend
    const response = NextResponse.json(backendData, { status: 200 });

    // Forward all cookies from backend response to frontend
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    console.log('Set-Cookie header from backend:', setCookieHeader);
    
    if (setCookieHeader) {
      // Handle multiple cookies by splitting them
      const cookies = setCookieHeader.split(',').map(cookie => cookie.trim());
      cookies.forEach(cookie => {
        console.log('Forwarding cookie:', cookie);
        response.headers.append('Set-Cookie', cookie);
      });
    } else {
      console.log('No Set-Cookie header found in backend response');
    }

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure this route is server-side rendered


// app/api/auth/login/route.ts
