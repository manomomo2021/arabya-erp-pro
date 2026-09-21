import sql from 'mssql';

const configArabyaDB = {
  server: 'DESKTOP-NP2I106',
  port: 1433,
  database: 'ArabyaDB',
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

async function discoverDatabase(config: sql.config, dbName: string) {
  const pool = await new sql.ConnectionPool(config).connect();
  
  console.log(`\n=== ${dbName} - ALL TABLES ===`);
  const tables = await pool.request().query(`
    SELECT 
      s.name AS SchemaName, 
      t.name AS TableName,
      p.[rows] AS TableRowCount,
      CAST(SUM(a.total_pages) * 8.0 / 1024 AS DECIMAL(10,2)) AS SizeMB
    FROM sys.tables t
    JOIN sys.schemas s ON s.schema_id = t.schema_id
    JOIN sys.indexes i ON t.object_id = i.object_id
    JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
    JOIN sys.allocation_units a ON p.partition_id = a.container_id
    WHERE i.index_id IN (0, 1)
    GROUP BY s.name, t.name, p.[rows]
    ORDER BY p.[rows] DESC
  `);
  console.table(tables.recordset);
  
  // Get columns for each table
  console.log(`\n=== ${dbName} - TABLE COLUMNS ===`);
  for (const table of tables.recordset) {
    const columns = await pool.request()
      .input('tableName', sql.NVarChar(128), table.TableName)
      .query(`
        SELECT 
          c.name AS ColumnName,
          ty.name AS DataType,
          c.max_length AS MaxLength,
          c.precision AS Precision,
          c.scale AS Scale,
          c.is_nullable AS IsNullable,
          c.is_identity AS IsIdentity,
          CASE WHEN pk.column_id IS NOT NULL THEN 1 ELSE 0 END AS IsPrimaryKey,
          ep.value AS ColumnDescription
        FROM sys.columns c
        JOIN sys.types ty ON ty.user_type_id = c.user_type_id
        LEFT JOIN (
          SELECT ic.column_id, ic.object_id
          FROM sys.index_columns ic
          JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id
          WHERE i.is_primary_key = 1
        ) pk ON pk.object_id = c.object_id AND pk.column_id = c.column_id
        LEFT JOIN sys.extended_properties ep ON ep.major_id = c.object_id AND ep.minor_id = c.column_id AND ep.name = 'MS_Description'
        WHERE c.object_id = OBJECT_ID(@tableName)
        ORDER BY c.column_id
      `);
    
    if (columns.recordset.length > 0) {
      console.log(`\n--- ${table.TableName} (${table.RowCount} rows) ---`);
      console.table(columns.recordset);
    }
  }
  
  // Get foreign keys
  console.log(`\n=== ${dbName} - FOREIGN KEYS ===`);
  const fks = await pool.request().query(`
    SELECT 
      OBJECT_NAME(fk.parent_object_id) AS TableName,
      COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ColumnName,
      OBJECT_NAME(fk.referenced_object_id) AS ReferencedTable,
      COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS ReferencedColumn,
      fk.name AS FKName
    FROM sys.foreign_keys fk
    JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
    ORDER BY TableName, ColumnName
  `);
  console.table(fks.recordset);
  
  // Get views
  console.log(`\n=== ${dbName} - VIEWS ===`);
  const views = await pool.request().query(`
    SELECT 
      s.name AS SchemaName,
      v.name AS ViewName,
      OBJECT_DEFINITION(v.object_id) AS Definition
    FROM sys.views v
    JOIN sys.schemas s ON s.schema_id = v.schema_id
    ORDER BY s.name, v.name
  `);
  console.table(views.recordset);
  
  // Get stored procedures
  console.log(`\n=== ${dbName} - STORED PROCEDURES ===`);
  const sps = await pool.request().query(`
    SELECT 
      s.name AS SchemaName,
      p.name AS ProcedureName,
      OBJECT_DEFINITION(p.object_id) AS Definition
    FROM sys.procedures p
    JOIN sys.schemas s ON s.schema_id = p.schema_id
    ORDER BY s.name, p.name
  `);
  console.table(sps.recordset);
  
  await pool.close();
}

async function main() {
  try {
    await discoverDatabase(configArabyaDB, 'ArabyaDB');
    await discoverDatabase(configArabyaSC, 'ArabyaSC');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();