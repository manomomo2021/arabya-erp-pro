import { query, sql } from './query';

export async function getTableCatalog() {
  const r = await query<any>(`SELECT s.name AS SchemaName, t.name AS TableName, SUM(CASE WHEN c.is_identity=1 THEN 1 ELSE 0 END) AS IdentityColumns, COUNT(c.column_id) AS ColumnCount
    FROM sys.tables t JOIN sys.schemas s ON s.schema_id=t.schema_id JOIN sys.columns c ON c.object_id=t.object_id
    GROUP BY s.name,t.name ORDER BY s.name,t.name`);
  return r.recordset;
}
export async function getTableColumns(table: string) {
  const r = await query<any>(`SELECT c.name AS ColumnName, ty.name AS DataType, c.max_length AS MaxLength, c.is_nullable AS IsNullable, c.is_identity AS IsIdentity
    FROM sys.columns c JOIN sys.tables t ON t.object_id=c.object_id JOIN sys.types ty ON ty.user_type_id=c.user_type_id
    WHERE t.name=@table ORDER BY c.column_id`, [{name:'table',type:sql.NVarChar(128),value:table}]);
  return r.recordset;
}
