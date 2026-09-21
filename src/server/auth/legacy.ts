import { queryOne, sql } from '../db/query';
import { createHash } from 'crypto';

/**
 * Read-only adapter for the legacy ERP HUB application authentication model.
 * It never creates/changes objects in ArabyaDB.
 *
 * IMPORTANT: the exact legacy password storage/algorithm must be configured from
 * verified ERP HUB evidence. We do not guess it in application code.
 */
function env(name: string, fallback = '') { return process.env[name]?.trim() || fallback; }
function identifier(value: string, name: string) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) throw new Error(`${name} يحتوي على اسم SQL غير صالح.`);
  return value;
}

export type LegacyAuthResult = {
  userId: string;
  userName: string;
  branchCode?: number;
  status?: number;
};

export async function verifyLegacyErpLogin(username: string, password: string): Promise<LegacyAuthResult> {
  const rawTable = env('ERP_AUTH_TABLE');
  const rawUserColumn = env('ERP_AUTH_USER_COLUMN');
  const rawPasswordColumn = env('ERP_AUTH_PASSWORD_COLUMN');
  if (!rawTable || !rawUserColumn || !rawPasswordColumn) {
    throw new Error('مصادقة ERP HUB غير مكتملة: يجب تحديد ERP_AUTH_TABLE وERP_AUTH_USER_COLUMN وERP_AUTH_PASSWORD_COLUMN بعد التحقق من Trace الخاص بالنظام القديم.');
  }
  const table = identifier(rawTable, 'ERP_AUTH_TABLE');
  const userColumn = identifier(rawUserColumn, 'ERP_AUTH_USER_COLUMN');
  const passwordColumn = identifier(rawPasswordColumn, 'ERP_AUTH_PASSWORD_COLUMN');
  const statusColumn = env('ERP_AUTH_STATUS_COLUMN') ? identifier(env('ERP_AUTH_STATUS_COLUMN'), 'ERP_AUTH_STATUS_COLUMN') : '';
  const branchColumn = env('ERP_AUTH_BRANCH_COLUMN') ? identifier(env('ERP_AUTH_BRANCH_COLUMN'), 'ERP_AUTH_BRANCH_COLUMN') : '';
  const passwordMode = env('ERP_AUTH_PASSWORD_MODE', 'plaintext').toLowerCase();

  if (passwordMode !== 'plaintext' && passwordMode !== 'md5') {
    throw new Error(`طريقة كلمة المرور الحالية (${passwordMode}) غير مفعلة قبل توثيق خوارزمية ERP HUB الفعلية.`);
  }

  const hash = (s: string) => createHash('md5').update(s).digest('hex');
  const comparePassword = passwordMode === 'md5' ? hash(password) : password;

  const statusSql = statusColumn ? `, ISNULL([${statusColumn}],0) AS [__status]` : '';
  const branchSql = branchColumn ? `, [${branchColumn}] AS [__branch]` : '';
  const db = env('ERP_AUTH_DATABASE');
  const schema = env('ERP_AUTH_SCHEMA', 'dbo');
  if (!db) throw new Error('مصادقة ERP HUB غير مكتملة: يجب تحديد ERP_AUTH_DATABASE بعد التحقق من Trace الخاص بالنظام القديم.');
  const fullTable = `[${db}].${schema}.${table}`;
  const result = await queryOne<any>(
    `SELECT TOP (1) [${userColumn}] AS [__user]${statusSql}${branchSql}
     FROM ${fullTable}
     WHERE [${userColumn}]=@u AND CONVERT(nvarchar(4000),[${passwordColumn}])=@p`,
    [
      { name: 'u', type: sql.NVarChar(200), value: username },
      { name: 'p', type: sql.NVarChar(4000), value: comparePassword },
    ],
  );
  if (!result) throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة.');
  if (statusColumn && Number(result.__status || 0) !== 0) throw new Error('المستخدم غير نشط في النظام القديم.');
  return { userId: String(result.__user), userName: String(result.__user), branchCode: branchColumn ? Number(result.__branch || 0) || undefined : undefined, status: statusColumn ? Number(result.__status || 0) : undefined };
}
