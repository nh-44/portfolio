import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { requireAdmin } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  // Cloudinary automatically checks process.env.CLOUDINARY_URL, but we can verify it
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || ''
  });
}

// Multer memory storage configuration (keeps files in RAM buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max limit
});

// Helper: Stream buffer upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'portfolio') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // Detects image, pdf, video automatically
        transformation: [
          { quality: 'auto', fetch_format: 'auto' } // Auto-optimise (WebP/AVIF, compression)
        ]
      },
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

  try {
    const result = await uploadToCloudinary(req.file.buffer, targetFolder);
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

export default router;
