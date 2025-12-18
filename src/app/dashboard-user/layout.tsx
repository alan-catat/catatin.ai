import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import ClientProviders from './clientprovider';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    // ✅ Await cookies() untuk Next.js 15
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      redirect('/auth/signin');
    }

    // ✅ Verifikasi JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'default-secret-key-please-change-in-production-min-32-chars'
    );
    
    const { payload } = await jwtVerify(token, secret);

    // ✅ Type assertion untuk payload
    const user = {
      id: (payload.userId as string) || (payload.email as string),
      email: payload.email as string,
      name: (payload.name as string) || '',
    };

    return <ClientProviders user={user}>{children}</ClientProviders>;
    
  } catch (error) {
    // ✅ Handle error (token invalid/expired)
    console.error('Auth error:', error);
    redirect('/auth/signin');
  }
}