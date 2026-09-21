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

// Key business tables to analyze
const keyTables = [
  // Core
  'Branches', 'Period', 'Items', 'Customer', 'Supplier', 'Stores',
  // Accounting
  'Accounts', 'TrxHeaderGA', 'TrxDetail', 'Journals', 'PerAccounts', 'PerJournals', 'PerSafeCode', 'PerSubLedgerCode',
  // Sales
  'Invoice', 'QuotationH', 'QuotationD', 'SalesRep', 'SalesSupervisor',
  // Purchasing
  'PurchaseOrderH', 'PurchaseOrderD', 'GoodsReceiptH', 'GoodsReceiptD',
  // Inventory
  'TrxDetail', 'StockTakingH', 'StockTakingD', 'HoldFile',
  // Manufacturing
  'ProductionOrderH', 'ProductionOrderD', 'ProductionBOMHeader', 'ProductionBOMDetail', 'ProductionCompletionH', 'ProductionCompletionD',
  // Costing
  'ProductionRawMaterialCost', 'ProductionServiceCost', 'ProductionStandardCost', 'ProductionServiceItemsCost',
  // HR (key ones)
  'Employees', 'Departments', 'M800_Employees',
  // Quality
  'QualityAssurance', 'QualityAssuranceElement', 'QualityAssuranceGroupH', 'QualityAssuranceGroupD',
  // Others
  'Units', 'Units2', 'ItemGroups', 'ItemCategories', 'CostCenters', 'Projects'
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

async function getForeignKeys(pool: sql.ConnectionPool, tableName: string) {
  const result = await pool.request()
    .input('tableName', sql.NVarChar(128), tableName)
    .query(`
      SELECT 
        OBJECT_NAME(fk.parent_object_id) AS TableName,
        COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ColumnName,
        OBJECT_NAME(fk.referenced_object_id) AS ReferencedTable,
        COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS ReferencedColumn,
        fk.name AS FKName
      FROM sys.foreign_keys fk
      JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
      WHERE OBJECT_NAME(fk.parent_object_id) = @tableName
         OR OBJECT_NAME(fk.referenced_object_id) = @tableName
      ORDER BY TableName, ColumnName
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
  
  console.log('=== DATABASE CAPABILITY MAP ===\n');
  
  for (const table of keyTables) {
    try {
      const columns = await getTableColumns(pool, table);
      const rowCount = await getTableRowCount(pool, table);
      const fks = await getForeignKeys(pool, table);
      
      if (columns.length === 0) {
        console.log(`\n--- ${table} --- NOT FOUND`);
        continue;
      }
      
      console.log(`\n=== ${table} (${rowCount} rows) ===`);
      console.log('Columns:');
      console.table(columns);
      
      if (fks.length > 0) {
        console.log('Foreign Keys:');
        console.table(fks);
      }
    } catch (error) {
      console.log(`\n--- ${table} --- ERROR: ${error}`);
    }
  }
  
  await pool.close();
}

main().catch(console.error);