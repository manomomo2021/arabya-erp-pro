import { NextResponse } from 'next/server';
import { getSession } from '@/src/server/auth/session';

export async function GET() {
  const s = await getSession();
  const response = s ? NextResponse.json({ user: s }) : NextResponse.json({ user: null }, { status: 401 });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
