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
      connectionLimit: 3, // Reduced for development
      queueLimit: 0,
      enableKeepAlive: false, // Disable keep-alive
      idleTimeout: 60000, // Close idle connections after 60 seconds
      maxIdle: 2, // Max idle connections
    });

    // Log when pool is created
    console.log('[DB] Connection pool created');
  }
  return globalForDb.mysqlPool;
}

// Execute a query with parameters
export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const pool = getPool();
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error) {
    // If too many connections, try to end pool and recreate
    if ((error as NodeJS.ErrnoException).code === 'ER_CON_COUNT_ERROR') {
      console.error('[DB] Too many connections, attempting to reset pool...');
      await closePool();
    }
    throw error;
  }
}

// Get a connection for transactions
export async function getConnection(): Promise<mysql.PoolConnection> {
  const pool = getPool();
  const connection = await pool.getConnection();
  return connection;
}

// Close the pool (for graceful shutdown)
export async function closePool(): Promise<void> {
  if (globalForDb.mysqlPool) {
    try {
      await globalForDb.mysqlPool.end();
      console.log('[DB] Connection pool closed');
    } catch (error) {
      console.error('[DB] Error closing pool:', error);
    }
    globalForDb.mysqlPool = undefined;
  }
}
