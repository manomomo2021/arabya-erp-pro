import { NextResponse } from 'next/server';
import { authenticate, setSession } from '@/src/server/auth/session';
import { loginSchema } from '@/src/server/validation';
import { audit } from '@/src/server/audit/store';

export async function POST(req: Request) {
  let username = 'UNKNOWN';
  try {
    const input = loginSchema.parse(await req.json());
    username = input.username;
    const user = await authenticate(input.username, input.password, input.branchCode, input.financialYear);
    await setSession(user);
    await audit('LOGIN', 'SECURITY', 'تسجيل الدخول', input.username, 'تسجيل دخول ناجح', input.username);
    return NextResponse.json({ success: true, user });
  } catch (e: any) {
    console.error('[AUTH_LOGIN_FAILED]', { username, error: e?.message || String(e) });
    try { await audit('LOGIN_FAILED', 'SECURITY', 'تسجيل الدخول', username, 'فشل تسجيل الدخول', username, 'FAILED'); } catch (auditError) { console.error('[AUTH_AUDIT_FAILED]', auditError); }
    return NextResponse.json({ success: false, error: 'بيانات الدخول غير صحيحة أو أن مصادقة ERP HUB لم تُهيأ بعد.' }, { status: 401 });
  }
}
