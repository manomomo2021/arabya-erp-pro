import sql from 'mssql';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const config: sql.config = {
  server: process.env.MSSQL_SERVER || 'SERVER1',
  port: Number(process.env.MSSQL_PORT || 1433),
  database: process.env.MSSQL_DATABASE || 'ArabyaDB',
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.MSSQL_TRUST_SERVER_CERTIFICATE !== 'false',
    enableArithAbort: true,
  },
  connectionTimeout: Number(process.env.MSSQL_CONNECTION_TIMEOUT || 30000),
  requestTimeout: Number(process.env.MSSQL_REQUEST_TIMEOUT || 60000),
};

async function discoverDatabase() {
  console.log('=== ARABYA ERP PRO - DATABASE DISCOVERY ===\n');
  console.log(`Connecting to ${config.server}/${config.database}...\n`);

  if (!config.user || !config.password) {
    console.error('ERROR: MSSQL_USER and MSSQL_PASSWORD required');
    process.exit(1);
  }

  const pool = await new sql.ConnectionPool(config).connect();
  
  const result: any = {
    databaseName: config.database,
    discoveredAt: new Date().toISOString(),
    tables: [],
    views: [],
    storedProcedures: [],
    functions: [],
    relationships: [],
    summary: {}
  };

  try {
    // 1. Get all tables with row counts
    console.log('Discovering tables...');
    const tablesResult = await pool.request().query(`
      SELECT 
        s.name AS SchemaName,
        t.name AS TableName,
        p.rows AS RowCount,
        OBJECT_DEFINITION(t.object_id) AS Definition
      FROM sys.tables t
      JOIN sys.schemas s ON s.schema_id = t.schema_id
      LEFT JOIN sys.partitions p ON p.object_id = t.object_id AND p.index_id IN (0,1)
      ORDER BY s.name, t.name
    `);
    
    result.summary.totalTables = tablesResult.recordset.length;
    console.log(`Found ${tablesResult.recordset.length} tables\n`);

    // 2. Get all columns for each table
    console.log('Discovering columns...');
    for (const table of tablesResult.recordset) {
      const columnsResult = await pool.request()
        .input('table', sql.NVarChar(128), table.TableName)
        .query(`
          SELECT 
            c.name AS ColumnName,
            ty.name AS DataType,
            c.max_length AS MaxLength,
            c.precision AS Precision,
            c.scale AS Scale,
            c.is_nullable AS IsNullable,
            c.is_identity AS IsIdentity,
            COLUMNPROPERTY(c.object_id, c.name, 'IsRowGuidCol') AS IsRowGuid,
            dc.definition AS DefaultValue
          FROM sys.columns c
          JOIN sys.tables t ON t.object_id = c.object_id
          JOIN sys.types ty ON ty.user_type_id = c.user_type_id
          LEFT JOIN sys.default_constraints dc ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
          WHERE t.name = @table
          ORDER BY c.column_id
        `);

      // 3. Get primary keys
      const pkResult = await pool.request()
        .input('table', sql.NVarChar(128), table.TableName)
        .query(`
          SELECT 
            k.name AS PKName,
            c.name AS ColumnName,
            kc.key_ordinal AS KeyOrdinal
          FROM sys.key_constraints k
          JOIN sys.tables t ON t.object_id = k.parent_object_id
          JOIN sys.index_columns kc ON kc.object_id = k.parent_object_id AND kc.index_id = k.unique_index_id
          JOIN sys.columns c ON c.object_id = kc.object_id AND c.column_id = kc.column_id
          WHERE t.name = @table AND k.type = 'PK'
          ORDER BY kc.key_ordinal
        `);

      // 4. Get foreign keys
      const fkResult = await pool.request()
        .input('table', sql.NVarChar(128), table.TableName)
        .query(`
          SELECT 
            fk.name AS FKName,
            pt.name AS ParentTable,
            pc.name AS ParentColumn,
            rt.name AS ReferencedTable,
            rc.name AS ReferencedColumn
          FROM sys.foreign_keys fk
          JOIN sys.tables pt ON pt.object_id = fk.parent_object_id
          JOIN sys.tables rt ON rt.object_id = fk.referenced_object_id
          JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
          JOIN sys.columns pc ON pc.object_id = fkc.parent_object_id AND pc.column_id = fkc.parent_column_id
          JOIN sys.columns rc ON rc.object_id = fkc.referenced_object_id AND rc.column_id = fkc.referenced_column_id
          WHERE pt.name = @table OR rt.name = @table
        `);

      result.relationships.push(...fkResult.recordset);

      result.tables.push({
        schema: table.SchemaName,
        name: table.TableName,
        rowCount: table.RowCount || 0,
        columns: columnsResult.recordset,
        primaryKey: pkResult.recordset,
        foreignKeys: fkResult.recordset.filter((fk: any) => fk.ParentTable === table.TableName)
      });

      console.log(`  - ${table.TableName}: ${columnsResult.recordset.length} columns, ${table.RowCount || 0} rows`);
    }

    // 5. Get all views
    console.log('\nDiscovering views...');
    const viewsResult = await pool.request().query(`
      SELECT 
        s.name AS SchemaName,
        v.name AS ViewName,
        OBJECT_DEFINITION(v.object_id) AS Definition
      FROM sys.views v
      JOIN sys.schemas s ON s.schema_id = v.schema_id
      ORDER BY s.name, v.name
    `);
    result.summary.totalViews = viewsResult.recordset.length;
    result.views = viewsResult.recordset;
    console.log(`Found ${viewsResult.recordset.length} views\n`);

    // 6. Get stored procedures
    console.log('Discovering stored procedures...');
    const procsResult = await pool.request().query(`
      SELECT 
        s.name AS SchemaName,
        p.name AS ProcedureName,
        OBJECT_DEFINITION(p.object_id) AS Definition
      FROM sys.procedures p
      JOIN sys.schemas s ON s.schema_id = p.schema_id
      ORDER BY s.name, p.name
    `);
    result.summary.totalProcedures = procsResult.recordset.length;
    result.storedProcedures = procsResult.recordset;
    console.log(`Found ${procsResult.recordset.length} stored procedures\n`);

    // 7. Get functions
    console.log('Discovering functions...');
    const funcsResult = await pool.request().query(`
      SELECT 
        s.name AS SchemaName,
        f.name AS FunctionName,
        f.type_desc AS FunctionType,
        OBJECT_DEFINITION(f.object_id) AS Definition
      FROM sys.objects f
      JOIN sys.schemas s ON s.schema_id = f.schema_id
      WHERE f.type IN ('FN', 'IF', 'TF')
      ORDER BY s.name, f.name
    `);
    result.summary.totalFunctions = funcsResult.recordset.length;
    result.functions = funcsResult.recordset;
    console.log(`Found ${funcsResult.recordset.length} functions\n`);

    // Remove duplicates from relationships
    result.relationships = Array.from(new Map(result.relationships.map((r: any) => [r.FKName, r])).values());
    result.summary.totalRelationships = result.relationships.length;

  } catch (error) {
    console.error('Discovery error:', error);
    throw error;
  } finally {
    await pool.close();
  }

  return result;
}

// Run discovery
discoverDatabase()
  .then(result => {
    // Save to file
    const outputPath = path.join(__dirname, 'docs', 'DATABASE_DISCOVERY_FULL.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`\n✅ Discovery complete! Results saved to ${outputPath}`);
    
    // Print summary
    console.log('\n=== DATABASE SUMMARY ===');
    console.log(`Database: ${result.databaseName}`);
    console.log(`Total Tables: ${result.summary.totalTables}`);
    console.log(`Total Views: ${result.summary.totalViews}`);
    console.log(`Total Stored Procedures: ${result.summary.totalProcedures}`);
    console.log(`Total Functions: ${result.summary.totalFunctions}`);
    console.log(`Total Relationships: ${result.summary.totalRelationships}`);
    
    // Print table list grouped by likely module
    console.log('\n=== TABLES BY MODULE (PRELIMINARY) ===');
    const modules: {[key: string]: string[]} = {
      'ACCOUNTING': [],
      'SALES': [],
      'PURCHASES': [],
      'INVENTORY': [],
      'MANUFACTURING': [],
      'COLD_STORAGE': [],
      'QUALITY': [],
      'HR': [],
      'MASTER_DATA': [],
      'SYSTEM': []
    };

    for (const table of result.tables) {
      const name = table.name.toUpperCase();
      if (name.includes('ACC') || name.includes('GL') || name.includes('JOURNAL') || name.includes('LEDGER')) {
        modules.ACCOUNTING.push(table.name);
      } else if (name.includes('SALE') || name.includes('INVOICE') || name.includes('CUSTOMER')) {
        modules.SALES.push(table.name);
      } else if (name.includes('PURCH') || name.includes('SUPPLIER') || name.includes('VENDOR')) {
        modules.PURCHASES.push(table.name);
      } else if (name.includes('ITEM') || name.includes('STOCK') || name.includes('WAREHOUSE') || name.includes('INV')) {
        modules.INVENTORY.push(table.name);
      } else if (name.includes('PROD') || name.includes('BOM') || name.includes('ROUTING')) {
        modules.MANUFACTURING.push(table.name);
      } else if (name.includes('COLD') || name.includes('STORAGE') || name.includes('TEMP')) {
        modules.COLD_STORAGE.push(table.name);
      } else if (name.includes('QUAL') || name.includes('INSPECT')) {
        modules.QUALITY.push(table.name);
      } else if (name.includes('EMP') || name.includes('HR') || name.includes('PAYROLL')) {
        modules.HR.push(table.name);
      } else if (name.includes('BRANCH') || name.includes('PERIOD') || name.includes('YEAR')) {
        modules.SYSTEM.push(table.name);
      } else {
        modules.MASTER_DATA.push(table.name);
      }
    }

    for (const [module, tables] of Object.entries(modules)) {
      if (tables.length > 0) {
        console.log(`\n${module} (${tables.length}):`);
        tables.forEach(t => console.log(`  - ${t}`));
      }
    }
  })
  .catch(err => {
    console.error('Discovery failed:', err);
    process.exit(1);
  });
