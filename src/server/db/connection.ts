import sql from 'mssql';

const config: sql.config = {
  server: process.env.MSSQL_SERVER || 'SERVER1',
  port: Number(process.env.MSSQL_PORT || 1433),
  database: process.env.MSSQL_DATABASE || 'ArabyaDB',
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === 'true',
    trustServerCertificate:
      process.env.MSSQL_TRUST_SERVER_CERTIFICATE !== 'false',
    enableArithAbort: true,
  },
  connectionTimeout: Number(process.env.MSSQL_CONNECTION_TIMEOUT || 15000),
  requestTimeout: Number(process.env.MSSQL_REQUEST_TIMEOUT || 30000),
  pool: {
    max: 20,
    min: 1,
    idleTimeoutMillis: 30000,
  },
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export function getDbConfig() {
  return {
    server: config.server,
    port: config.port,
    database: config.database,
  };
}

export async function getDBPool() {
  if (!config.user || !config.password) {
    throw new Error(
      'MSSQL_USER و MSSQL_PASSWORD مطلوبان على الخادم.'
    );
  }

  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .catch((e: unknown) => {
        poolPromise = null;
        throw e;
      });
  }

  return poolPromise;
}

export async function testDBConnection() {
  const started = Date.now();

  try {
    const pool = await getDBPool();

    const r = await pool.request().query(`
      SELECT
        @@VERSION AS [version],
        DB_NAME() AS [database],
        (SELECT COUNT(*) FROM sys.tables) AS [totalTables]
    `);

    return {
      connected: true,
      ...getDbConfig(),
      sqlServerVersion: r.recordset[0]?.version || '',
      totalTables: Number(r.recordset[0]?.totalTables || 0),
      latencyMs: Date.now() - started,
      lastCheckedAt: new Date().toISOString(),
    };
  } catch (e: unknown) {
    const error = e as {
      message?: string;
      code?: string;
    };

    return {
      connected: false,
      ...getDbConfig(),
      sqlServerVersion: '',
      totalTables: 0,
      latencyMs: Date.now() - started,
      lastCheckedAt: new Date().toISOString(),
      error: error.message || 'فشل الاتصال بقاعدة البيانات',
      errorCode: error.code || 'DB_ERROR',
    };
  }
}

/**
 * Verify SQL Server credentials without changing ArabyaDB.
 * Used only when APP_AUTH_MODE=sql-login.
 */
export async function verifySqlLogin(
  username: string,
  password: string
) {
  const loginConfig: sql.config = {
    server: config.server,
    port: config.port,
    database: config.database,
    user: username,
    password,
    options: config.options,
    connectionTimeout: Number(
      process.env.MSSQL_CONNECTION_TIMEOUT || 15000
    ),
    requestTimeout: 10000,
    pool: {
      max: 1,
      min: 0,
      idleTimeoutMillis: 5000,
    },
  };

  const pool = await new sql.ConnectionPool(loginConfig).connect();

  try {
    await pool.request().query('SELECT 1 AS [ok]');
    return true;
  } finally {
    await pool.close();
  }
}

export { sql };