import express from 'express';
import { query } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all skill categories with nested skills
router.get('/categories', async (req, res) => {
  try {
    const categoriesResult = await query('SELECT * FROM skill_categories ORDER BY display_order ASC, id ASC');
    const skillsResult = await query('SELECT * FROM skills ORDER BY id ASC');

    const categories = categoriesResult.rows.map(cat => ({
      ...cat,
      items: skillsResult.rows.filter(skill => skill.category_id === cat.id)
    }));

    return res.json(categories);
  } catch (err) {
    console.error('Error fetching skills categories:', err);
    return res.status(500).json({ error: 'Failed to fetch skills.' });
  }
});

// POST create skill category (Admin only)
router.post('/categories', requireAdmin, async (req, res) => {
  const { category, description, display_order } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'Category title is required.' });
  }

  try {
    const result = await query(
      `INSERT INTO skill_categories (category, description, display_order) 
       VALUES ($1, $2, $3) RETURNING *`,
      [category, description || '', display_order || 0]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating skill category:', err);
    return res.status(500).json({ error: 'Failed to create skill category.' });
  }
});

// PUT update skill category (Admin only)
router.put('/categories/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { category, description, display_order } = req.body;
  if (!category) {
    return res.status(400).json({ error: 'Category title is required.' });
  }

  try {
    const result = await query(
      `UPDATE skill_categories 
       SET category = $1, description = $2, display_order = $3 
       WHERE id = $4 RETURNING *`,
      [category, description || '', display_order || 0, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating skill category:', err);
    return res.status(500).json({ error: 'Failed to update skill category.' });
  }
});

// DELETE skill category (Admin only)
router.delete('/categories/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM skill_categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('Error deleting skill category:', err);
    return res.status(500).json({ error: 'Failed to delete category.' });
  }
});

// POST add skill item to category (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  const { category_id, name, level, icon } = req.body;
  if (!category_id || !name) {
    return res.status(400).json({ error: 'category_id and name are required fields.' });
  }

  try {
    const result = await query(
      `INSERT INTO skills (category_id, name, level, icon) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [category_id, name, level || 80, icon || 'Code2']
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating skill item:', err);
    return res.status(500).json({ error: 'Failed to add skill item.' });
  }
});

// PUT update skill item (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, level, icon } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Skill name is required.' });
  }

  try {
    const result = await query(
      `UPDATE skills SET name = $1, level = $2, icon = $3 
       WHERE id = $4 RETURNING *`,
      [name, level || 80, icon || 'Code2', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill item not found.' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating skill item:', err);
    return res.status(500).json({ error: 'Failed to update skill item.' });
  }
});

// DELETE skill item (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM skills WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill item not found.' });
    }
    return res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (err) {
    console.error('Error deleting skill item:', err);
    return res.status(500).json({ error: 'Failed to delete skill item.' });
  }
});

export default router;
