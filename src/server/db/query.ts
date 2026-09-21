import { getDBPool, sql } from './connection';
import { validateSQLSafety } from './guards';

export type Param = { name: string; type: any; value: unknown };
export async function query<T = any>(text: string, params: Param[] = []) {
  validateSQLSafety(text);
  const pool = await getDBPool();
  const req = pool.request();
  for (const p of params) req.input(p.name, p.type, p.value as any);
  return req.query<T>(text);
}
export async function queryOne<T = any>(text: string, params: Param[] = []) {
  const r = await query<T>(text, params);
  return r.recordset[0] ?? null;
}
export { sql };
