// app/api/notifications/route.ts

import { NextResponse } from "next/server";

let notifications: any[] = [];

export async function GET() {
  return NextResponse.json(notifications);
}

export async function POST(req: Request) {
  const data = await req.json();

  if (!data.user || !data.message || !data.avatar) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newNotif = {
    id: Date.now(),
    user: data.user,
    message: data.message,
    avatar: data.avatar,
    time: new Date().toLocaleString(),
    read: false,
  };

  notifications.unshift(newNotif);
  return NextResponse.json({ success: true, notif: newNotif });
}
