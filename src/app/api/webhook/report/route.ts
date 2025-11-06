// app/api/webhook/report/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'report.json');
const EXPECTED_SECRET = process.env.WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    // optional security: cek header secret
    const secret = request.headers.get('x-webhook-secret') || '';
    if (EXPECTED_SECRET && secret !== EXPECTED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // body.payload diharapkan array; jika langsung object, handle fleksibel
    const payload = Array.isArray(body.payload) ? body.payload : (body.payload ? [body.payload] : body);

    // ensure data dir exists
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

    fs.writeFileSync(FILE_PATH, JSON.stringify(payload, null, 2), 'utf-8');

    return NextResponse.json({ ok: true, received: payload.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
