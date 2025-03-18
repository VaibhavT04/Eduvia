import { drizzle } from 'drizzle-orm/neon-http';

console.log("Database Connection String:", process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING);
export const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING);
