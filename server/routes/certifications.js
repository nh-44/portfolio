import express from 'express';
import { query } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all certifications
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM certifications ORDER BY date DESC, id DESC');
    return res.json(result.rows);
  } catch (err) {
    console.error('Error fetching certifications:', err);
    return res.status(500).json({ error: 'Failed to fetch certifications.' });
  }
});

// POST create certification (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  const { title, issuer, date, verification_url, badge_image_url, certificate_pdf_url, badge_color, type } = req.body;
  
  if (!title || !issuer || !date) {
    return res.status(400).json({ error: 'Title, issuer, and date are required fields.' });
  }

  try {
    const result = await query(
      `INSERT INTO certifications 
       (title, issuer, date, verification_url, badge_image_url, certificate_pdf_url, badge_color, type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [title, issuer, date, verification_url || '', badge_image_url || '', certificate_pdf_url || '', badge_color || '#EA4335', type || 'cloud']
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating certification:', err);
    return res.status(500).json({ error: 'Failed to create certification.' });
  }
});

// PUT update certification (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, issuer, date, verification_url, badge_image_url, certificate_pdf_url, badge_color, type } = req.body;

  if (!title || !issuer || !date) {
    return res.status(400).json({ error: 'Title, issuer, and date are required fields.' });
  }

  try {
    const result = await query(
      `UPDATE certifications 
       SET title = $1, issuer = $2, date = $3, verification_url = $4, badge_image_url = $5, certificate_pdf_url = $6, badge_color = $7, type = $8 
       WHERE id = $9 
       RETURNING *`,
      [title, issuer, date, verification_url || '', badge_image_url || '', certificate_pdf_url || '', badge_color || '#EA4335', type || 'cloud', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certification not found.' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating certification:', err);
    return res.status(500).json({ error: 'Failed to update certification.' });
  }
});

// DELETE certification (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM certifications WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certification not found.' });
    }
    return res.json({ success: true, message: 'Certification deleted successfully.' });
  } catch (err) {
    console.error('Error deleting certification:', err);
    return res.status(500).json({ error: 'Failed to delete certification.' });
  }
});

export default router;
