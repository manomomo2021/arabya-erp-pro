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

const keyTables2 = [
  // Accounting
  'TrxHeaderGA', 'TrxDetail', 'Journals', 'PerAccounts', 'PerJournals', 'PerSafeCode', 'PerSubLedgerCode', 'SafeTrxHTemplete', 'SafeTrxDTemplete', 'SafeTrxLedgers', 'SafeTrxLedgersAccounts',
  // Sales/Purchasing
  'Invoice', 'QuotationH', 'QuotationD', 'PurchaseOrderH', 'PurchaseOrderD', 'GoodsReceiptH', 'GoodsReceiptD',
  // Inventory
  'StockTakingH', 'StockTakingD', 'TrxConversion', 'HoldFile', 'Items', 'Stores', 'Locations',
  // Others
  'Customer', 'Supplier', 'SalesRep', 'SalesSupervisor', 'Branches', 'Period', 'Accounts',
  // Production
  'ProductionOrderH', 'ProductionOrderD', 'ProductionRollInformation',
  // Setup
  'VATSetup', 'Currency', 'PaymentTerms', 'ShipVia', 'ItemCategories', 'ItemGroups',
];

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
  return result.recordset;
}

async function getTableRowCount(pool: sql.ConnectionPool, tableName: string) {
  const result = await pool.request()
    .input('tableName', sql.NVarChar(128), tableName)
    .query(`SELECT COUNT(*) AS cnt FROM ${tableName}`);
  return result.recordset[0]?.cnt || 0;
}

async function main() {
  const pool = await new sql.ConnectionPool(configArabyaDB).connect();
  
  for (const table of keyTables2) {
    try {
      const columns = await getTableColumns(pool, table);
      const rowCount = await getTableRowCount(pool, table);
      
      if (columns.length === 0) {
        console.log(`\n--- ${table} --- NOT FOUND`);
        continue;
      }
      
      console.log(`\n=== ${table} (${rowCount} rows) ===`);
      console.log('Columns:');
      console.table(columns.slice(0, 50)); // Limit output
    } catch (error) {
      console.log(`\n--- ${table} --- ERROR: ${error}`);
    }
  }
  
  await pool.close();
}

main().catch(console.error);