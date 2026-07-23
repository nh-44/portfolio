import express from 'express';
import { query } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM projects ORDER BY featured DESC, created_at DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    return res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// GET single project by slug
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await query('SELECT * FROM projects WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching project:', err);
    return res.status(500).json({ error: 'Failed to fetch project details.' });
  }
});

// CREATE project
router.post('/', requireAdmin, async (req, res) => {
  const {
    title,
    slug,
    short_description,
    long_description,
    cover_image,
    gallery, // Array
    tech_stack, // Array
    github_url,
    demo_url,
    status,
    tags, // Array
    featured
  } = req.body;

  if (!title || !slug || !short_description) {
    return res.status(400).json({ error: 'Title, slug, and short description are required.' });
  }

  try {
    // Check if slug exists
    const checkSlug = await query('SELECT id FROM projects WHERE slug = $1', [slug]);
    if (checkSlug.rows.length > 0) {
      return res.status(400).json({ error: 'A project with this slug already exists.' });
    }

    const insertQuery = `
      INSERT INTO projects (
        title, slug, short_description, long_description, cover_image, gallery, tech_stack, github_url, demo_url, status, tags, featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      title,
      slug.toLowerCase().trim().replace(/\s+/g, '-'),
      short_description,
      long_description || '',
      cover_image || '',
      JSON.stringify(gallery || []),
      JSON.stringify(tech_stack || []),
      github_url || '',
      demo_url || '',
      status || 'completed',
      JSON.stringify(tags || []),
      featured || false
    ];

    const result = await query(insertQuery, values);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    return res.status(500).json({ error: 'Failed to create project.' });
  }
});

// UPDATE project
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    short_description,
    long_description,
    cover_image,
    gallery,
    tech_stack,
    github_url,
    demo_url,
    status,
    tags,
    featured
  } = req.body;

  try {
    const checkProject = await query('SELECT * FROM projects WHERE id = $1', [id]);
    if (checkProject.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const current = checkProject.rows[0];
    const formattedSlug = slug
      ? slug.toLowerCase().trim().replace(/\s+/g, '-')
      : current.slug;

    // Check slug collision
    if (slug && formattedSlug !== current.slug) {
      const checkSlug = await query('SELECT id FROM projects WHERE slug = $1 AND id != $2', [formattedSlug, id]);
      if (checkSlug.rows.length > 0) {
        return res.status(400).json({ error: 'A project with this slug already exists.' });
      }
    }

    const updateQuery = `
      UPDATE projects
      SET title = $1,
          slug = $2,
          short_description = $3,
          long_description = $4,
          cover_image = $5,
          gallery = $6,
          tech_stack = $7,
          github_url = $8,
          demo_url = $9,
          status = $10,
          tags = $11,
          featured = $12
      WHERE id = $13
      RETURNING *
    `;

    const values = [
      title !== undefined ? title : current.title,
      formattedSlug,
      short_description !== undefined ? short_description : current.short_description,
      long_description !== undefined ? long_description : current.long_description,
      cover_image !== undefined ? cover_image : current.cover_image,
      gallery !== undefined ? JSON.stringify(gallery) : JSON.stringify(current.gallery),
      tech_stack !== undefined ? JSON.stringify(tech_stack) : JSON.stringify(current.tech_stack),
      github_url !== undefined ? github_url : current.github_url,
      demo_url !== undefined ? demo_url : current.demo_url,
      status !== undefined ? status : current.status,
      tags !== undefined ? JSON.stringify(tags) : JSON.stringify(current.tags),
      featured !== undefined ? featured : current.featured,
      id
    ];

    const result = await query(updateQuery, values);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    return res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE project
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    return res.json({ success: true, message: 'Project deleted successfully.', project: result.rows[0] });
  } catch (err) {
    console.error('Error deleting project:', err);
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
});

export default router;
