import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function RootRedirect() {
  const headersList = await headers();
  const host = headersList.get("host");

  // ✅ Check authentication DULU
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key-minimum-32-characters-long'
      );
      await jwtVerify(token, secret);
      isAuthenticated = true;
      console.log('✅ User authenticated in page.tsx');
    } catch (error) {
      console.log('❌ Token invalid in page.tsx');
      isAuthenticated = false;
    }
  }

  // Domain-based routing
  if (host === "admin.catatin.ai") {
    redirect("/dashboard-admin");
  }

  if (host === "app.catatin.ai") {
    redirect("/dashboard-user");
  }

  // ✅ Localhost routing - check auth first!
  if (isAuthenticated) {
    console.log('🔄 Redirecting authenticated user to dashboard');
    redirect("/dashboard-user");
  }

  // User belum login, ke home
  console.log('👤 Guest user, redirecting to home');
  redirect("/home");
}