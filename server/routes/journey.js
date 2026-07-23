import express from 'express';
import { query } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all journey milestones
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM journey ORDER BY timeline_order ASC, created_at ASC');
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching journey:', err);
    return res.status(500).json({ error: 'Failed to fetch journey milestones.' });
  }
});

// CREATE journey milestone
router.post('/', requireAdmin, async (req, res) => {
  const {
    title,
    date,
    description,
    category,
    lessons_learned,
    technologies_used, // Array
    location,
    thumbnail,
    gallery, // Array
    timeline_order
  } = req.body;

  if (!title || !date || !description || !category) {
    return res.status(400).json({ error: 'Title, date, description, and category are required.' });
  }

  try {
    const insertQuery = `
      INSERT INTO journey (
        title, date, description, category, lessons_learned, technologies_used, location, thumbnail, gallery, timeline_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      title,
      date,
      description,
      category,
      lessons_learned || '',
      JSON.stringify(technologies_used || []),
      location || '',
      thumbnail || '',
      JSON.stringify(gallery || []),
      timeline_order !== undefined ? parseInt(timeline_order) : 0
    ];

    const result = await query(insertQuery, values);
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating milestone:', err);
    return res.status(500).json({ error: 'Failed to create journey milestone.' });
  }
});

// UPDATE journey milestone
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    date,
    description,
    category,
    lessons_learned,
    technologies_used,
    location,
    thumbnail,
    gallery,
    timeline_order
  } = req.body;

  try {
    const checkMilestone = await query('SELECT * FROM journey WHERE id = $1', [id]);
    if (checkMilestone.rows.length === 0) {
      return res.status(404).json({ error: 'Journey milestone not found.' });
    }

    const current = checkMilestone.rows[0];

    const updateQuery = `
      UPDATE journey
      SET title = $1,
          date = $2,
          description = $3,
          category = $4,
          lessons_learned = $5,
          technologies_used = $6,
          location = $7,
          thumbnail = $8,
          gallery = $9,
          timeline_order = $10
      WHERE id = $11
      RETURNING *
    `;

    const values = [
      title !== undefined ? title : current.title,
      date !== undefined ? date : current.date,
      description !== undefined ? description : current.description,
      category !== undefined ? category : current.category,
      lessons_learned !== undefined ? lessons_learned : current.lessons_learned,
      technologies_used !== undefined ? JSON.stringify(technologies_used) : JSON.stringify(current.technologies_used),
      location !== undefined ? location : current.location,
      thumbnail !== undefined ? thumbnail : current.thumbnail,
      gallery !== undefined ? JSON.stringify(gallery) : JSON.stringify(current.gallery),
      timeline_order !== undefined ? parseInt(timeline_order) : current.timeline_order,
      id
    ];

    const result = await query(updateQuery, values);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating milestone:', err);
    return res.status(500).json({ error: 'Failed to update journey milestone.' });
  }
});

// DELETE journey milestone
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM journey WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journey milestone not found.' });
    }
    return res.json({ success: true, message: 'Milestone deleted successfully.', milestone: result.rows[0] });
  } catch (err) {
    console.error('Error deleting milestone:', err);
    return res.status(500).json({ error: 'Failed to delete journey milestone.' });
  }
});

export default router;
