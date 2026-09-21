import { NextResponse } from 'next/server';
import { query } from '@/src/server/db/query';
import { authOr401, errorResponse } from '@/src/server/route-helpers';

export async function GET() {
  const a = await authOr401();
  if ('response' in a) return a.response;
  try {
    console.log('[BANKS_API] Starting query...');
    const rows = await query<any>(
      `SELECT BankCode, BankAraName, BankAccountNo, IBANCode, BankSwiftCode
       FROM BankCode
       ORDER BY BankCode`
    );
    console.log('[BANKS_API] Query returned', rows.recordset?.length || 0, 'rows');
    console.log('[BANKS_API] Sample:', JSON.stringify(rows.recordset?.[0] || null));
    return NextResponse.json(rows.recordset);
  } catch (e) {
    console.error('[BANKS_API] Error:', e);
    return errorResponse(e);
  }
}
