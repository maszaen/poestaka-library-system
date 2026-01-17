import mysql from 'mysql2/promise';

// Extend global type for development hot reload
const globalForDb = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

// Singleton connection pool - persists across hot reloads in development
function getPool(): mysql.Pool {
  if (!globalForDb.mysqlPool) {
    globalForDb.mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'poestaka',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return globalForDb.mysqlPool;
}

// Execute a query with parameters
export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const pool = getPool();
  const [results] = await pool.execute(sql, params);
  return results as T;
}

// Get a connection for transactions
export async function getConnection(): Promise<mysql.PoolConnection> {
  const pool = getPool();
  return await pool.getConnection();
}

// Close the pool (for graceful shutdown)
export async function closePool(): Promise<void> {
  if (globalForDb.mysqlPool) {
    await globalForDb.mysqlPool.end();
    globalForDb.mysqlPool = undefined;
  }
}
