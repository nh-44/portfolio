import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn("Warning: DATABASE_URL environment variable is not defined. PostgreSQL connection will fail.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : {
    rejectUnauthorized: false // Required for Neon cloud PostgreSQL
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
