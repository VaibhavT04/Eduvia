import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

console.log('All environment variables:', process.env);
console.log('Database connection string:', process.env.DATABASE_CONNECTION_STRING);

if (!process.env.DATABASE_CONNECTION_STRING) {
  throw new Error('DATABASE_CONNECTION_STRING environment variable is not set');
}

// Create a connection pool
const sql = neon(process.env.DATABASE_CONNECTION_STRING, {
  connectionTimeoutMillis: 10000,
  maxRetries: 3
});

// Create the drizzle instance
export const db = drizzle(sql, {
  logger: true // Enable query logging for debugging
});
