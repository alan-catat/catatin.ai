// clientprovider.tsx
'use client';

import { AuthProvider } from '@/lib/auth-context';
import AdminLayout from './AdminLayout';

interface User {
  id: string;
  email: string;
  name: string;
}

interface ClientProvidersProps {
  children: React.ReactNode;
  user: User;
}

export default function ClientProviders({
  children,
  user,
}: ClientProvidersProps) {
  return (
    <AuthProvider initialUser={user}>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}