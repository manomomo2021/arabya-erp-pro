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

async function getTables(config: sql.config, dbName: string) {
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
  
  await pool.close();
  return tables.recordset;
}

async function main() {
  try {
    await getTables(configArabyaDB, 'ArabyaDB');
    await getTables(configArabyaSC, 'ArabyaSC');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();