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

const defaultConfig = {
  theme: 'beams',
  beams: {
    beamWidth: 1.5,
    beamHeight: 12,
    beamNumber: 30,
    lightColor: '#ffffff',
    speed: 10,
    noiseIntensity: 2.75,
    scale: 0.35,
    rotation: 0
  },
  antigravity: {
    count: 300,
    magnetRadius: 10,
    ringRadius: 10,
    waveSpeed: 0.4,
    waveAmplitude: 1,
    particleSize: 2,
    lerpSpeed: 0.1,
    color: '#8c6b1a',
    autoAnimate: false,
    particleVariance: 1,
    rotationSpeed: 0,
    depthFactor: 1,
    pulseSpeed: 3,
    particleShape: 'capsule',
    fieldStrength: 10
  }
};

const run = async () => {
  const client = await pool.connect();
  try {
    console.log("Adding background_config column to site_settings...");
    await client.query(`
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS background_config JSONB DEFAULT '${JSON.stringify(defaultConfig)}'::jsonb;
    `);
    console.log("✓ Added background_config column to site_settings successfully.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
};

run();
