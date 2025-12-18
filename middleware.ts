import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Skip middleware untuk API routes, static files, dll
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  console.log('🔍 Middleware - Path:', pathname, '| Has Token:', !!token);

  // ✅ JIKA USER SUDAH LOGIN (ada token)
  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key-minimum-32-characters-long'
      );
      await jwtVerify(token, secret);
      
      console.log('✅ Token valid');

      if (pathname === '/' || pathname === '/home' || pathname === '/auth/dashboard-user/signin') {
  return NextResponse.redirect(new URL('/dashboard-user', request.url));
}

      // ✅ Allow access ke dashboard dan pages lain
      return NextResponse.next();

    } catch {
  return NextResponse.redirect(
    new URL('/auth/dashboard-user/signin', request.url)
  );
}

  }

  // ❌ JIKA USER BELUM LOGIN (tidak ada token)
  
  // Redirect ke login jika coba akses protected route
  if (pathname.startsWith('/dashboard-user')) {
    console.log('🔒 Protected route, redirecting to signin');
    return NextResponse.redirect(new URL('/auth/dashboard-user/signin', request.url));
  }

  // Allow access ke public pages (/, /home, /auth/*)
  console.log('👍 Public page, allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Match semua path kecuali Next.js internals
  ],
};