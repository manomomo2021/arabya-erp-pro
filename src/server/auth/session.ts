import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';
import { logLogin, userStores } from '../db/repositories';
import { verifyLegacyErpLogin } from './legacy';

const COOKIE = 'arabya_erp_session';
const secret = () => process.env.SESSION_SECRET || '';
function sign(payload: string) { return createHmac('sha256', secret()).update(payload).digest('base64url'); }
function encode(data: any) {
  const p = Buffer.from(JSON.stringify({ ...data, exp: Date.now() + Number(process.env.SESSION_TTL_SECONDS || 28800) * 1000 })).toString('base64url');
  return `${p}.${sign(p)}`;
}
function decode(token: string) {
  try {
    const [p, s] = token.split('.');
    if (!p || !s || !secret()) return null;
    const expected = sign(p);
    const sb = Buffer.from(s), eb = Buffer.from(expected);
    if (sb.length !== eb.length || !timingSafeEqual(sb, eb)) return null;
    const d = JSON.parse(Buffer.from(p, 'base64url').toString());
    if (Date.now() > d.exp) return null;
    return d;
  } catch { return null; }
}
export async function setSession(user: any) {
  (await cookies()).set(COOKIE, encode(user), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: Number(process.env.SESSION_TTL_SECONDS || 28800) });
}
export async function clearSession() { (await cookies()).delete(COOKIE); }
export async function getSession() { const token = (await cookies()).get(COOKIE)?.value; return token ? decode(token) : null; }
export async function authenticate(username: string, password: string, branch: number, year: number) {
  if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET غير مضبوط.');
  if ((process.env.APP_AUTH_MODE || 'erp-hub') !== 'erp-hub') throw new Error('APP_AUTH_MODE يجب أن يكون erp-hub حتى يتم استخدام مصادقة ERP HUB الموثقة.');
  const legacy = await verifyLegacyErpLogin(username, password);
  const stores = await userStores(username);
  const effectiveBranch = legacy.branchCode || branch;
  await logLogin(username, effectiveBranch);
  return {
    userId: legacy.userId,
    userName: legacy.userName,
    role: username.toLowerCase() === 'sa' ? 'ADMIN' : 'OPERATOR',
    branchCode: effectiveBranch,
    financialYear: year,
    permissions: (process.env.APP_DEFAULT_PERMISSIONS || 'VIEW').split(',').map(x => x.trim()).filter(Boolean),
    allowedStores: stores.map((x: any) => Number(x.StoreCode)).filter(Boolean),
  };
}
export { COOKIE };
