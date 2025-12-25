import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // 1. Validasi internal token (WAJIB)
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.INTERNAL_N8N_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { order_id, email, status, raw } = body;

  // 2. Idempotency check (contoh)
  // if (order already processed) return ok

  // 3. Update database
  // await activatePlan(email, order_id);

  return NextResponse.json({ success: true });
}
