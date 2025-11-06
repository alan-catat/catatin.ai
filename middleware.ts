import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ IZINKAN Webhook & Midtrans tanpa redirect
  if (
    pathname.startsWith("/api/webhook/report") || 
    pathname.startsWith("/api/midtrans")
  ) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";

  // Kalau admin.catatin.ai → redirect ke /dashboard-admin
  if (hostname === "tim.catatin.ai" && url.pathname === "/") {
    url.pathname = "/dashboard-admin";
    return NextResponse.redirect(url);
  }

  // Kalau app.catatin.ai → redirect ke /dashboard-user
  if (hostname === "user.catatin.ai" && url.pathname === "/") {
    url.pathname = "/dashboard-user";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
