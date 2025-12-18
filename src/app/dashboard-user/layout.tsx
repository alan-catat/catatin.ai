// app/dashboard-user/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientProviders from "./clientprovider";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/auth/signin");
  }

  return <ClientProviders>{children}</ClientProviders>;
}