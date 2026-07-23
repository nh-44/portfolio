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

const defaultDossier = {
  status: "Available for Internships",
  location: "Bangalore, India",
  education: "B.Tech CSE",
  graduation: "2027",
  currentMission: "Building PatentEase",
  specialization: ["AI", "Backend", "Cloud"],
  openTo: ["SDE", "AI Engineer", "Backend Engineer"],
  stats: {
    projects: "15+",
    leadershipRoles: "3",
    hackathons: "8",
    teamsLed: "35+",
    researchProjects: "2"
  }
};

const run = async () => {
  const client = await pool.connect();
  try {
    console.log("Adding dossier column to site_settings table...");
    await client.query(`
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS dossier JSONB DEFAULT '${JSON.stringify(defaultDossier)}'::jsonb;
    `);
    console.log("✓ Added dossier column to site_settings successfully.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
};

run();
