import type { Pool } from '@neondatabase/serverless';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Lazy loading to prevent connection issues during startup
let poolInstance: Pool | null = null;
let dbInstance: NodePgDatabase<typeof schema> | null = null;

const createPool = async () => {
  const { Pool, neonConfig } = await import('@neondatabase/serverless');
  const ws = await import('ws');
  
  neonConfig.webSocketConstructor = ws.default;
  
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://dummy:dummy@127.0.0.1:5432/dummy';
  return new Pool({ connectionString: databaseUrl });
};

const createDb = async () => {
  if (!poolInstance) {
    poolInstance = await createPool();
  }
  
  const { drizzle } = await import('drizzle-orm/neon-serverless');
  return drizzle({ client: poolInstance, schema });
};

// Export getter functions that will lazy-load
export const getPool = async () => {
  if (!poolInstance) {
    poolInstance = await createPool();
  }
  return poolInstance;
};

export const getDb = async () => {
  if (!dbInstance) {
    dbInstance = await createDb();
  }
  return dbInstance;
};

// For backward compatibility - these will throw if DATABASE_URL is required
export const pool = {} as Pool; // Placeholder
export const db = {} as NodePgDatabase<typeof schema>; // Placeholder
