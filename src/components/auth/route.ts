// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Validasi user (sesuaikan dengan database Anda)
  // const user = await validateUser(email, password);
  
  // Buat JWT token
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ userId: 'user123', email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2d') // 2 hari
    .sign(secret);
  
  // Set cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 2, // 2 hari dalam detik
    path: '/',
  });
  
  return response;
}