import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const run = async () => {
  const client = await pool.connect();
  try {
    console.log("Checking and altering site_settings table...");
    await client.query(`
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS background_theme TEXT DEFAULT 'tactical_mesh';
    `);
    console.log("✓ Added background_theme column to site_settings.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
};

run();
