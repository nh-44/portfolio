import { v2 as cloudinary } from 'cloudinary';
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
  }
}

async function test() {
  // Use the public_id of the private resource we uploaded in the previous test
  const publicId = 'portfolio/test_private/test_resume_private.pdf';
  console.log(`Generating private download URL for: ${publicId}`);

  try {
    const signedUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'raw',
      type: 'private',
      expires_at: Math.floor(Date.now() / 1000) + 3600
    });
    console.log(`Generated private download URL: ${signedUrl}`);

    const res = await fetch(signedUrl);
    console.log(`Fetch HTTP Status: ${res.status}`);
    if (res.ok) {
      console.log('✓ SUCCESS! The private download URL returned 200 OK and works!');
      // Write the first few bytes to check if it's indeed a PDF
      const buf = await res.arrayBuffer();
      console.log(`Received buffer size: ${buf.byteLength} bytes`);
    } else {
      console.log('✗ FAILED: Private download URL returned', res.status);
      const text = await res.text();
      console.log('Error details:', text);
    }
  } catch (err) {
    console.error('Error during test:', err);
  }
}

test();
