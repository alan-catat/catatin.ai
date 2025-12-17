// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Ambil cookie dari request
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    // Jika tidak ada token, user belum login
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'default-secret-key-please-change-in-production-minimum-32-characters-long'
    );

    const { payload } = await jwtVerify(token, secret);

    // Return user data dari JWT payload
    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
      },
    });

  } catch (error: any) {
    console.error('Auth verification error:', error);
    
    // Jika token invalid/expired
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}