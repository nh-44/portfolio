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

const parseCloudinaryUrl = (url) => {
  // Capture the version digits (if present) and the remainder of the path
  const match = url.match(/cloudinary\.com\/[^/]+\/(raw|image|video)\/upload\/(?:v(\d+)\/)?(.+)$/);
  if (!match) return null;
  
  const resourceType = match[1];
  const version = match[2] || '';
  let publicId = match[3];
  let format = '';
  
  const extMatch = publicId.match(/\.([^.]+)$/);
  if (extMatch) {
    format = extMatch[1];
    publicId = publicId.replace(/\.[^.]+$/, '');
  }
  
  return { 
    resourceType, 
    version,
    publicId, 
    format 
  };
};

const getAuthenticatedCloudinaryUrl = (url) => {
  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;

  try {
    const opts = {
      resource_type: parsed.resourceType,
      type: 'upload',
      sign_url: true,
      secure: true
    };
    if (parsed.format) {
      opts.format = parsed.format;
    }
    if (parsed.version) {
      opts.version = parsed.version;
    }
    
    return cloudinary.url(parsed.publicId, opts);
  } catch (e) {
    console.error('Failed to sign URL:', e.message);
    return url;
  }
};

async function test() {
  const url = 'https://res.cloudinary.com/jjw6qjpz/image/upload/v1784739672/portfolio/resume/Resume_Naveen_S_GKN.pdf';
  const signedUrl = getAuthenticatedCloudinaryUrl(url);
  console.log(`Generated signed URL: ${signedUrl}`);

  try {
    const res = await fetch(signedUrl);
    console.log(`Fetch HTTP Status: ${res.status}`);
    if (res.ok) {
      console.log('✓ Success! The signed URL works and can be fetched without credentials!');
    } else {
      console.log('✗ Failed: Still returning error code', res.status);
    }
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}

test();
