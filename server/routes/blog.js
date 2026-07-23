import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

// GET all blogs (public vs admin draft status check)
router.get('/', async (req, res) => {
  const token = req.cookies?.admin_token;
  let isAdmin = false;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isAdmin = true;
    } catch (e) {
      // Ignore token decode errors for public visitors
    }
  }

  try {
    const dbQuery = isAdmin
      ? 'SELECT * FROM blog ORDER BY created_at DESC'
      : "SELECT * FROM blog WHERE status = 'published' ORDER BY created_at DESC";

    const result = await query(dbQuery);
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    return res.status(500).json({ error: 'Failed to fetch blog posts.' });
  }
});

// GET single blog by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const token = req.cookies?.admin_token;
  let isAdmin = false;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      isAdmin = true;
    } catch (e) {}
  }

  try {
    const result = await query('SELECT * FROM blog WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    const post = result.rows[0];
    if (post.status !== 'published' && !isAdmin) {
      return res.status(403).json({ error: 'Access denied. This post is a draft.' });
    }

    return res.json(post);
  } catch (err) {
    console.error('Error fetching blog post:', err);
    return res.status(500).json({ error: 'Failed to fetch blog post.' });
  }
});

// CREATE blog post
router.post('/', requireAdmin, async (req, res) => {
  const {
    title,
    slug,
    cover_image,
    reading_time,
    tags, // Array
    category,
    markdown_content,
    gallery, // Array
    status,
    journey_id
  } = req.body;

  if (!title || !slug || !markdown_content || !category) {
    return res.status(400).json({ error: 'Title, slug, markdown content, and category are required.' });
  }

  try {
    // Check if slug exists
    const checkSlug = await query('SELECT id FROM blog WHERE slug = $1', [slug]);
    if (checkSlug.rows.length > 0) {
      return res.status(400).json({ error: 'A blog post with this slug already exists.' });
    }

    const insertQuery = `
      INSERT INTO blog (
        title, slug, cover_image, reading_time, tags, category, markdown_content, gallery, status, journey_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      title,
      slug.toLowerCase().trim().replace(/\s+/g, '-'),
      cover_image || '',
      reading_time || '3 min read',
      JSON.stringify(tags || []),
      category,
      markdown_content,
      JSON.stringify(gallery || []),
      status || 'draft',
      journey_id ? parseInt(journey_id) : null
    ];

    const result = await query(insertQuery, values);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating blog post:', err);
    return res.status(500).json({ error: 'Failed to create blog post.' });
  }
});

// UPDATE blog post
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    cover_image,
    reading_time,
    tags,
    category,
    markdown_content,
    gallery,
    status,
    journey_id
  } = req.body;

  try {
    const checkBlog = await query('SELECT * FROM blog WHERE id = $1', [id]);
    if (checkBlog.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    const current = checkBlog.rows[0];
    const formattedSlug = slug
      ? slug.toLowerCase().trim().replace(/\s+/g, '-')
      : current.slug;

    // Check slug collision
    if (slug && formattedSlug !== current.slug) {
      const checkSlug = await query('SELECT id FROM blog WHERE slug = $1 AND id != $2', [formattedSlug, id]);
      if (checkSlug.rows.length > 0) {
        return res.status(400).json({ error: 'A blog post with this slug already exists.' });
      }
    }

    const updateQuery = `
      UPDATE blog
      SET title = $1,
          slug = $2,
          cover_image = $3,
          reading_time = $4,
          tags = $5,
          category = $6,
          markdown_content = $7,
          gallery = $8,
          status = $9,
          journey_id = $10
      WHERE id = $11
      RETURNING *
    `;

    const values = [
      title !== undefined ? title : current.title,
      formattedSlug,
      cover_image !== undefined ? cover_image : current.cover_image,
      reading_time !== undefined ? reading_time : current.reading_time,
      tags !== undefined ? JSON.stringify(tags) : JSON.stringify(current.tags),
      category !== undefined ? category : current.category,
      markdown_content !== undefined ? markdown_content : current.markdown_content,
      gallery !== undefined ? JSON.stringify(gallery) : JSON.stringify(current.gallery),
      status !== undefined ? status : current.status,
      journey_id !== undefined ? (journey_id ? parseInt(journey_id) : null) : current.journey_id,
      id
    ];

    const result = await query(updateQuery, values);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating blog post:', err);
    return res.status(500).json({ error: 'Failed to update blog post.' });
  }
});

// DELETE blog post
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM blog WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }
    return res.json({ success: true, message: 'Blog post deleted successfully.', blog: result.rows[0] });
  } catch (err) {
    console.error('Error deleting blog post:', err);
    return res.status(500).json({ error: 'Failed to delete blog post.' });
  }
});

export default router;
