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

    // Here you would typically:
    // 1. Validate credentials against your database
    // 2. Create a session or JWT token
    // 3. Set HTTP-only cookies if using sessions

    // For now, return a success response
    return NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );
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
