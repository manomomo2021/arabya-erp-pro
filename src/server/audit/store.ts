import { query, queryOne, sql } from '../db/query';
import { getDBPool } from '../db/connection';

export async function audit(action:string,module:string,screen:string,recordKey:string,details:string,userId:string,status:'SUCCESS'|'FAILED'='SUCCESS',ip='') {
  // No in-memory audit. If an existing AuditLog table is present, use it; otherwise fail closed and log to server console.
  try {
    const exists = await queryOne<{x:number}>(`SELECT CASE WHEN OBJECT_ID('AuditLog','U') IS NULL THEN 0 ELSE 1 END x`);
    if (exists?.x) {
      const pool=await getDBPool(); const r=pool.request();
      r.input('timestamp',sql.DateTime2,new Date()).input('userId',sql.NVarChar(100),userId).input('action',sql.NVarChar(50),action).input('module',sql.NVarChar(100),module).input('screen',sql.NVarChar(200),screen).input('recordKey',sql.NVarChar(200),recordKey).input('details',sql.NVarChar(2000),details).input('ip',sql.NVarChar(64),ip).input('status',sql.NVarChar(20),status);
      await r.query(`INSERT INTO AuditLog(Timestamp,UserId,Action,Module,Screen,RecordKey,Details,IPAddress,Status) VALUES(@timestamp,@userId,@action,@module,@screen,@recordKey,@details,@ip,@status)`);
      return;
    }
  } catch (e) { console.error('[AUDIT_PERSISTENCE]',e); }
  console.log(JSON.stringify({timestamp:new Date().toISOString(),userId,action,module,screen,recordKey,details,ip,status}));
}
export async function getAudit() {
  try { const e=await queryOne<{x:number}>(`SELECT CASE WHEN OBJECT_ID('AuditLog','U') IS NULL THEN 0 ELSE 1 END x`); if(!e?.x) return []; return (await query<any>(`SELECT TOP (500) * FROM AuditLog ORDER BY 1 DESC`)).recordset; } catch { return []; }
}
