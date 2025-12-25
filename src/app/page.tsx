import { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import HomePage from "@/components/HomePage";

export const metadata: Metadata = {
  title: "catatin.ai",
};

export default async function RootPage() {
  const headersList = await headers();
  const host = headersList.get("host");

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key-minimum-32-characters-long"
      );
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // 🌐 Subdomain routing
  if (host === "admin.catatin.ai") redirect("/dashboard-admin");
  if (host === "app.catatin.ai") redirect("/dashboard-user");

  // 🔐 Auth routing
  if (isAuthenticated) redirect("/dashboard-user");

  // 👤 Guest → render HOME di root "/"
  return <HomePage />;
}
