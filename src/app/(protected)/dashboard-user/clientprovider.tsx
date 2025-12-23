
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/lib/auth-context";
import AdminLayout from "./AdminLayout";

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
      <ThemeProvider>
        <SidebarProvider>
          <AdminLayout>{children}</AdminLayout>
        </SidebarProvider>
      </ThemeProvider>
  );
}