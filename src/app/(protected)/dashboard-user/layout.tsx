// src/app/(protected)/dashboard-user/layout.tsx
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import ClientProviders from './clientprovider';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  // ❗ JANGAN DI DALAM try/catch
  if (!token) {
    redirect('/auth/dashboard-user/signin');
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ||
        'default-secret-key-please-change-in-production-min-32-chars'
    );

    const { payload } = await jwtVerify(token, secret);

    const user = {
      id: (payload.userId as string) || (payload.email as string),
      email: payload.email as string,
      name: (payload.name as string) || '',
    };

    return <ClientProviders user={user}>{children}</ClientProviders>;
  } catch (error) {
    // token ada tapi INVALID / EXPIRED
    redirect('/auth/dashboard-user/signin');
  }
}
