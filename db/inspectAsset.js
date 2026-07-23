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

async function inspect() {
  const publicId = 'portfolio/resume/Resume_Naveen_S_GKN';
  console.log(`Inspecting asset: ${publicId}`);

  try {
    // Try to get resource metadata
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'image'
    });
    console.log('Metadata result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.log('Failed to fetch as image, trying raw...');
    try {
      const result = await cloudinary.api.resource(publicId + '.pdf', {
        resource_type: 'raw'
      });
      console.log('Metadata result (raw):', JSON.stringify(result, null, 2));
    } catch (errRaw) {
      console.error('Failed both image and raw inspection:', errRaw.message);
    }
  }
}

inspect();
