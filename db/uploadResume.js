import { v2 as cloudinary } from 'cloudinary';
import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Parse CLOUDINARY_URL
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (cloudinaryUrl) {
  const match = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
  if (match) {
    cloudinary.config({
      api_key: match[1],
      api_secret: match[2],
      cloud_name: match[3],
      secure: true
    });
    console.log(`Cloudinary configured: cloud=${match[3]}`);
  } else {
    console.error('Could not parse CLOUDINARY_URL format');
    process.exit(1);
  }
} else {
  console.error('CLOUDINARY_URL not set in .env');
  process.exit(1);
}

async function upload() {
  const filePath = './Resume_Naveen_S_GKN_compressed.pdf';
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);
  console.log(`File loaded: ${fileBuffer.length} bytes. Uploading to Cloudinary as private raw resource...`);

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/resume',
          resource_type: 'raw',
          type: 'private', // PRIVATE RAW
          public_id: `Resume_Naveen_S_GKN.pdf`
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    const secureUrl = uploadResult.secure_url;
    console.log(`\n✓ Upload successful!`);
    console.log(`  URL: ${secureUrl}`);

    // Update database
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const check = await client.query('SELECT * FROM resume LIMIT 1');
    if (check.rows.length > 0) {
      await client.query(
        'UPDATE resume SET url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [secureUrl, check.rows[0].id]
      );
      console.log('✓ Database updated successfully.');
    } else {
      await client.query('INSERT INTO resume (url) VALUES ($1)', [secureUrl]);
      console.log('✓ New resume record inserted in database.');
    }

    await client.end();
    console.log(`\nDone! Resume is now available at:\n${secureUrl}`);
  } catch (err) {
    console.error('Upload failed:', err.message || err);
    process.exit(1);
  }
}

upload();
