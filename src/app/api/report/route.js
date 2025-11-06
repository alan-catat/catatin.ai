// app/api/report/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const FILE_PATH = path.join(process.cwd(), 'data', 'report.json');

export async function GET() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      return NextResponse.json([], { status: 200 });
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
