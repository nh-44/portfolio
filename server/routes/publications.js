import express from 'express';
import { query } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all publications
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM publications ORDER BY date DESC, id DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching publications:', err);
    return res.status(500).json({ error: 'Failed to fetch publications.' });
  }
});

// POST create publication (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  const { title, authors, journal_or_conference, date, verification_url, pdf_url } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required fields.' });
  }

  try {
    const result = await query(
      `INSERT INTO publications 
       (title, authors, journal_or_conference, date, verification_url, pdf_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, authors || '', journal_or_conference || '', date, verification_url || '', pdf_url || '']
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating publication:', err);
    return res.status(500).json({ error: 'Failed to create publication.' });
  }
});

// PUT update publication (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, authors, journal_or_conference, date, verification_url, pdf_url } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required.' });
  }

  try {
    const result = await query(
      `UPDATE publications 
       SET title = $1, authors = $2, journal_or_conference = $3, date = $4, verification_url = $5, pdf_url = $6 
       WHERE id = $7 RETURNING *`,
      [title, authors || '', journal_or_conference || '', date, verification_url || '', pdf_url || '', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating publication:', err);
    return res.status(500).json({ error: 'Failed to update publication.' });
  }
});

// DELETE publication (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM publications WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publication not found.' });
    }
    return res.json({ success: true, message: 'Publication deleted successfully.' });
  } catch (err) {
    console.error('Error deleting publication:', err);
    return res.status(500).json({ error: 'Failed to delete publication.' });
  }
});

export default router;
