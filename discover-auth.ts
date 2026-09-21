import sql from 'mssql';

const configArabyaSC = {
  server: 'DESKTOP-NP2I106',
  port: 1433,
  database: 'ArabyaSC',
  user: 'sa',
  password: '11111',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  connectionTimeout: 15000,
  requestTimeout: 30000,
};

const authTables = ['Users', 'BranchesPer', 'Programs', 'PrgPer', 'Groups', 'UserGroups', 'GroupPermission'];

async function getTableColumns(pool: sql.ConnectionPool, tableName: string) {
  const result = await pool.request()
    .input('tableName', sql.NVarChar(128), tableName)
    .query(`
      SELECT 
        c.name AS ColumnName,
        ty.name AS DataType,
        c.max_length AS MaxLength,
        c.precision AS Precision,
        c.scale AS Scale,
        c.is_nullable AS IsNullable,
        c.is_identity AS IsIdentity,
        CASE WHEN pk.column_id IS NOT NULL THEN 1 ELSE 0 END AS IsPrimaryKey
      FROM sys.columns c
      JOIN sys.types ty ON ty.user_type_id = c.user_type_id
      LEFT JOIN (
        SELECT ic.column_id, ic.object_id
        FROM sys.index_columns ic
        JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id
        WHERE i.is_primary_key = 1
      ) pk ON pk.object_id = c.object_id AND pk.column_id = c.column_id
      WHERE c.object_id = OBJECT_ID(@tableName)
      ORDER BY c.column_id
    `);
  return result.recordset;
}

async function getTableData(pool: sql.ConnectionPool, tableName: string) {
  const result = await pool.request().query(`SELECT TOP 20 * FROM ${tableName}`);
  return result.recordset;
}

async function main() {
  const pool = await new sql.ConnectionPool(configArabyaSC).connect();
  
  for (const table of authTables) {
    try {
      const columns = await getTableColumns(pool, table);
      const data = await getTableData(pool, table);
      
      if (columns.length === 0) {
        console.log(`\n--- ${table} --- NOT FOUND`);
        continue;
      }
      
      console.log(`\n=== ${table} (${data.length} sample rows) ===`);
      console.log('Columns:');
      console.table(columns);
      console.log('Sample Data:');
      console.table(data);
    } catch (error) {
      console.log(`\n--- ${table} --- ERROR: ${error}`);
    }
  }
  
  await pool.close();
}

main().catch(console.error);