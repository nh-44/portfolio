import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Configure Cloudinary — must explicitly parse CLOUDINARY_URL for sign_url to work
if (process.env.CLOUDINARY_URL) {
  const match = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
  if (match) {
    cloudinary.config({
      api_key: match[1],
      api_secret: match[2],
      cloud_name: match[3],
      secure: true
    });
  }
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true
  });
}

// Multer memory storage configuration (keeps files in RAM buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max limit
});

// Helper: Stream buffer upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'portfolio', isPdf = false, originalname = '') => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: isPdf ? 'raw' : 'auto'
    };

    // For raw resources like PDFs, we must preserve the file extension in public_id
    if (isPdf) {
      uploadOptions.type = 'private'; // Upload as private to bypass public access restrictions
      const cleanName = originalname
        ? originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_")
        : 'resume';
      const uniqueSuffix = Date.now();
      uploadOptions.public_id = `${cleanName}-${uniqueSuffix}.pdf`;
    } else {
      uploadOptions.transformation = [
        { quality: 'auto', fetch_format: 'auto' } // Auto-optimise (WebP/AVIF, compression)
      ];
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// GET all media assets from Cloudinary (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
      return res.json([]); // Return empty list instead of crashing if not configured
    }

    // Fetch resources with specific folder prefix
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'portfolio/',
      max_results: 100,
      direction: 'desc'
    });

    return res.json(result.resources || []);
  } catch (err) {
    console.error('Error fetching Cloudinary resources:', err);
    // If it fails because folder doesn't exist, return empty array
    return res.status(500).json({ error: 'Failed to retrieve media library assets.' });
  }
});

// UPLOAD asset (admin only)
router.post('/upload', requireAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const subfolder = req.query.folder || 'general'; // projects, journey, blogs, profile, etc.
  const targetFolder = `portfolio/${subfolder}`;
  const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');

  try {
    const result = await uploadToCloudinary(req.file.buffer, targetFolder, isPdf, req.file.originalname);
    return res.status(201).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
      resource_type: result.resource_type
    });
  } catch (err) {
    console.error('Cloudinary upload failure:', err);
    return res.status(500).json({ error: 'Failed to upload media to Cloudinary.' });
  }
});

// DELETE asset by public_id (admin only)
router.delete('/', requireAdmin, async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: 'public_id is required' });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result === 'ok') {
      return res.json({ success: true, message: 'Asset deleted successfully.' });
    }
    return res.status(400).json({ error: `Cloudinary response: ${result.result}` });
  } catch (err) {
    console.error('Cloudinary delete failure:', err);
    return res.status(500).json({ error: 'Failed to delete asset from Cloudinary.' });
  }
});

// Helper: extract resource_type, type (upload/private), version, public_id, and format from a Cloudinary URL
const parseCloudinaryUrl = (url) => {
  // Matches: https://res.cloudinary.com/cloud_name/resource_type/(upload|private|authenticated)/[signature/][version/]public_id
  const match = url.match(/cloudinary\.com\/[^/]+\/(raw|image|video)\/(upload|private|authenticated)\/(?:s--.*?--\/)?(?:v\d+\/)?(.+)$/);
  if (!match) return null;
  
  const resourceType = match[1];
  const deliveryType = match[2];
  let publicId = match[3];
  let format = '';
  
  // For raw resources, the file extension is part of the public_id itself
  if (resourceType !== 'raw') {
    const extMatch = publicId.match(/\.([^.]+)$/);
    if (extMatch) {
      format = extMatch[1];
      publicId = publicId.replace(/\.[^.]+$/, '');
    }
  } else {
    const extMatch = publicId.match(/\.([^.]+)$/);
    if (extMatch) {
      format = extMatch[1];
    }
  }
  
  return { resourceType, deliveryType, publicId, format };
};

// Helper: download file from Cloudinary using Admin API or signed URLs
const downloadFromCloudinary = async (url) => {
  const parsed = parseCloudinaryUrl(url);
  
  if (parsed) {
    try {
      // For private raw assets or restricted accounts, generate a signed private_download_url
      // This is the most reliable way to retrieve restricted files
      const signedUrl = cloudinary.utils.private_download_url(parsed.publicId, parsed.format || 'pdf', {
        resource_type: parsed.resourceType,
        type: parsed.deliveryType,
        expires_at: Math.floor(Date.now() / 1000) + 3600 // valid for 1 hour
      });
      
      console.log(`[proxy fetch] requesting signed URL: ${signedUrl.substring(0, 90)}...`);
      const fileRes = await fetch(signedUrl);
      console.log(`[proxy fetch] status: ${fileRes.status}`);
      if (fileRes.ok) return fileRes;
    } catch (e) {
      console.error('[downloadFromCloudinary] signed request failed:', e.message);
    }
  }

  // Fallback to direct fetch
  console.log(`[proxy fetch] fallback direct request: ${url}`);
  return await fetch(url);
};


// GET /api/media/view - proxies PDF inline (for iframe embedding, no download header)
router.get('/view', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'url parameter is required' });
  }

  try {
    const fileRes = await downloadFromCloudinary(url);
    if (!fileRes.ok) {
      throw new Error(`Failed to fetch file: ${fileRes.status} ${fileRes.statusText}`);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'private, max-age=3600');
    res.removeHeader('X-Content-Type-Options');

    const arrayBuffer = await fileRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Proxy view failed:', err.message);
    return res.status(500).json({ error: 'Failed to load PDF for viewing.', detail: err.message });
  }
});

// GET /api/media/download - proxies downloads with proper filename headers
router.get('/download', async (req, res) => {
  const { url, filename } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'url parameter is required' });
  }

  try {
    const fileRes = await downloadFromCloudinary(url);
    if (!fileRes.ok) {
      throw new Error(`Failed to fetch file: ${fileRes.status} ${fileRes.statusText}`);
    }

    const contentType = fileRes.headers.get('content-type') || 'application/pdf';
    const downloadName = filename || 'document.pdf';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.setHeader('Cache-Control', 'private, max-age=3600');

    const arrayBuffer = await fileRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Proxy download failed:', err.message);
    return res.redirect(url); // fallback redirect if proxy fails
  }
});

export default router;
