// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, n8nUrl } = body;

    console.log('Login attempt:', { email, n8nUrl }); // Debug log

    // Validasi ke n8n webhook
    const n8nWebhookUrl = n8nUrl || process.env.N8N_SIGNIN_URL;
    
    if (!n8nWebhookUrl) {
      console.error('N8N URL not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('Calling N8N webhook:', n8nWebhookUrl);

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    console.log('N8N Response status:', n8nResponse.status);

    // Parse response dari n8n
    const contentType = n8nResponse.headers.get('content-type');
    let userData: any;
    
    if (contentType?.includes('application/json')) {
      // Response JSON
      userData = await n8nResponse.json();
      console.log('N8N JSON response:', userData);
    } else {
      // Response text/plain
      const text = await n8nResponse.text();
      console.log('N8N text response:', text);
      
      if (text.toLowerCase().includes('sukses') || n8nResponse.ok) {
        userData = { 
          success: true,
          user: { 
            email: email,
            id: email,
            name: email.split('@')[0]
          }
        };
      } else {
        return NextResponse.json(
          { error: text || 'Login gagal' },
          { status: 401 }
        );
      }
    }

    // Check jika login gagal
    if (!n8nResponse.ok) {
      return NextResponse.json(
        { error: userData?.error || 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Check struktur response
    if (!userData.success && !userData.user) {
      return NextResponse.json(
        { error: userData?.error || 'Format response tidak valid' },
        { status: 401 }
      );
    }

    // Extract user data
    const userPayload = userData.user || { 
      email: email,
      id: userData.id || email,
      name: userData.name || email.split('@')[0]
    };

    console.log('User payload:', userPayload);

    // Generate JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'default-secret-key-please-change-in-production-min-32-chars'
    );
    
    const token = await new SignJWT({ 
  userId: userPayload.id || email,
  email: userPayload.email || email,
  name: userPayload.name || '',
  sessionId: crypto.randomUUID(), // ← ADD THIS: Unique per login
  deviceInfo: request.headers.get('user-agent')?.substring(0, 50) || 'unknown' // Optional
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt() // ← IMPORTANT: Timestamp
  .setJti(crypto.randomUUID()) // ← ADD THIS: JWT ID (unique identifier)
  .setExpirationTime('2d')
  .sign(secret);

console.log('🆔 Session ID:', token.substring(0, 30) + '...');

    const cookieExpires = new Date();
cookieExpires.setDate(cookieExpires.getDate() + 2);

    const response = NextResponse.json({
      success: true,
      user: {
        id: userPayload.id || email,
        email: userPayload.email || email,
        name: userPayload.name || email.split('@')[0],
        ...userPayload
      },
    });

    // ✅ Set cookie dengan expires explicit
const expires = new Date();
expires.setDate(expires.getDate() + 2); // 2 hari dari sekarang

response.cookies.set('auth-token', token, {
  httpOnly: true,
  secure: true,              // ⬅️ JANGAN conditional
  sameSite: 'none',          // ⬅️ INI KUNCI UTAMA
  path: '/',
  maxAge: 60 * 60 * 24 * 2,  // 2 hari
});

    console.log('Cookie set successfully');

    return response;

  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}