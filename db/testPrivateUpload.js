import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

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
  const filePath = './Resume_Naveen_S_GKN_compressed.pdf';
  if (!fs.existsSync(filePath)) {
    console.error('Local PDF not found');
    return;
  }
  const fileBuffer = fs.readFileSync(filePath);

  try {
    // 1. Upload as 'private' raw resource
    console.log('Uploading as private raw resource...');
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio/test_private',
          resource_type: 'raw',
          type: 'private', // MARK AS PRIVATE
          public_id: `test_resume_private.pdf`
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      ).end(fileBuffer);
    });

    console.log('Private upload result URL:', uploadResult.secure_url);
    const publicId = uploadResult.public_id;

    // 2. Generate signed URL for private raw resource with correct version
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: 'private',
      sign_url: true,
      secure: true,
      version: uploadResult.version // PASS THE VERSION
    });
    console.log(`Generated signed URL (with version): ${signedUrl}`);

    // 3. Try to fetch the signed URL
    const res = await fetch(signedUrl);
    console.log(`Fetch HTTP Status: ${res.status}`);
    if (res.ok) {
      console.log('✓ SUCCESS! Private raw asset with signed URL works perfectly!');
    } else {
      console.log('✗ FAILED: Private raw signed URL returned status', res.status);
    }
  } catch (err) {
    console.error('Error during test:', err);
  }
}

test();
