import { getDBPool, sql } from './connection';
import { validateSQLSafety, validateWriteTarget } from './guards';
import type { Param } from './query';

export async function withTransaction<T>(fn: (tx: sql.Transaction) => Promise<T>) {
  const pool = await getDBPool();
  const tx = new sql.Transaction(pool);
  await tx.begin(sql.ISOLATION_LEVEL.READ_COMMITTED);
  try { const result = await fn(tx); await tx.commit(); return result; }
  catch (e) { try { await tx.rollback(); } catch {} throw e; }
}
export async function txQuery(tx: sql.Transaction, table: string, text: string, params: Param[] = []) {
  validateWriteTarget(table); validateSQLSafety(text);
  const req = new sql.Request(tx);
  for (const p of params) req.input(p.name, p.type, p.value as any);
  return req.query(text);
}
