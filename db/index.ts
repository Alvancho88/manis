import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Test comment
// Ensures app crashes early with a clear error if the link is missing
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from .env file');
}

// Grabs the link from .env file
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });