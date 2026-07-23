import express from 'express';
import { query } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper: Get or create default settings
const getOrInitSettings = async () => {
  const result = await query('SELECT * FROM site_settings LIMIT 1');
  if (result.rows.length > 0) {
    return result.rows[0];
  }

  // Insert default row if empty
  const defaultQuery = `
    INSERT INTO site_settings (
      hero_heading, hero_description, current_focus, profile_picture_url, about_text, quick_facts, social_links, location, email, footer_text, seo_title, seo_description, accent_color, favicon_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `;
  const values = [
    "Naveen S",
    "Software Engineer-in-Training specializing in backend systems, document intelligence, applied machine learning, and GenAI tooling.",
    JSON.stringify(["Document Intelligence", "GenAI Tooling", "Applied ML", "Backend Systems"]),
    "",
    "Software Engineer-in-Training with experience in backend systems, document intelligence, applied machine learning, and GenAI tooling. Proven ability to build data processing pipelines involving PDF parsing, semantic similarity, and LLM-based reasoning. Demonstrated leadership across innovation projects, hackathons, and IEEE-published research.",
    JSON.stringify(["Final Year CS Student at PES University", "AI & ML", "Automotives", "Coding"]),
    JSON.stringify({ github: "https://github.com/nh-44", linkedin: "https://www.linkedin.com/in/nh44/", instagram: "https://www.instagram.com/naveenselvaraj_/", email: "naveenselvaraj.selva@gmail.com" }),
    "Bengaluru, India",
    "naveenselvaraj.selva@gmail.com",
    "© 2026 Naveen S. All rights reserved.",
    "Naveen S — Software Engineer & AI Specialist",
    "Personal portfolio and digital headquarters of Naveen S, Software Engineer specializing in Document Intelligence, GenAI, and Backend Systems.",
    "#06B6D4",
    ""
  ];

  const insertResult = await query(defaultQuery, values);
  return insertResult.rows[0];
};

// GET settings
router.get('/', async (req, res) => {
  try {
    const settings = await getOrInitSettings();
    // Expose Google Client ID dynamically to the client if configured
    settings.google_client_id = process.env.GOOGLE_CLIENT_ID || '';
    return res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    return res.status(500).json({ error: 'Failed to fetch site settings.' });
  }
});

// UPDATE settings
router.put('/', requireAdmin, async (req, res) => {
  const {
    hero_heading,
    hero_description,
    current_focus, // Array
    profile_picture_url,
    about_text,
    quick_facts, // Array
    social_links, // Object
    location,
    email,
    footer_text,
    seo_title,
    seo_description,
    accent_color,
    favicon_url,
    background_theme,
    background_config,
    dossier
  } = req.body;

  try {
    const current = await getOrInitSettings();
    const updateQuery = `
      UPDATE site_settings
      SET hero_heading = $1,
          hero_description = $2,
          current_focus = $3,
          profile_picture_url = $4,
          about_text = $5,
          quick_facts = $6,
          social_links = $7,
          location = $8,
          email = $9,
          footer_text = $10,
          seo_title = $11,
          seo_description = $12,
          accent_color = $13,
          favicon_url = $14,
          background_theme = $15,
          background_config = $16,
          dossier = $17,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $18
      RETURNING *
    `;

    const values = [
      hero_heading !== undefined ? hero_heading : current.hero_heading,
      hero_description !== undefined ? hero_description : current.hero_description,
      current_focus !== undefined ? JSON.stringify(current_focus) : JSON.stringify(current.current_focus),
      profile_picture_url !== undefined ? profile_picture_url : current.profile_picture_url,
      about_text !== undefined ? about_text : current.about_text,
      quick_facts !== undefined ? JSON.stringify(quick_facts) : JSON.stringify(current.quick_facts),
      social_links !== undefined ? JSON.stringify(social_links) : JSON.stringify(current.social_links),
      location !== undefined ? location : current.location,
      email !== undefined ? email : current.email,
      footer_text !== undefined ? footer_text : current.footer_text,
      seo_title !== undefined ? seo_title : current.seo_title,
      seo_description !== undefined ? seo_description : current.seo_description,
      accent_color !== undefined ? accent_color : current.accent_color,
      favicon_url !== undefined ? favicon_url : current.favicon_url,
      background_theme !== undefined ? background_theme : current.background_theme,
      background_config !== undefined ? (typeof background_config === 'string' ? background_config : JSON.stringify(background_config)) : (current.background_config ? JSON.stringify(current.background_config) : null),
      dossier !== undefined ? (typeof dossier === 'string' ? dossier : JSON.stringify(dossier)) : (current.dossier ? JSON.stringify(current.dossier) : null),
      current.id
    ];

    const result = await query(updateQuery, values);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating settings:', err);
    return res.status(500).json({ error: 'Failed to update settings.' });
  }
});

// GET resume
router.get('/resume', async (req, res) => {
  try {
    const result = await query('SELECT * FROM resume LIMIT 1');
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    }
    // Return empty if not set
    return res.json({ url: '' });
  } catch (err) {
    console.error('Error fetching resume:', err);
    return res.status(500).json({ error: 'Failed to fetch resume.' });
  }
});

// UPDATE resume
router.put('/resume', requireAdmin, async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Resume URL is required.' });
  }

  try {
    const result = await query('SELECT * FROM resume LIMIT 1');
    if (result.rows.length > 0) {
      const updateResult = await query(
        'UPDATE resume SET url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [url, result.rows[0].id]
      );
      return res.json(updateResult.rows[0]);
    } else {
      const insertResult = await query(
        'INSERT INTO resume (url) VALUES ($1) RETURNING *',
        [url]
      );
      return res.json(insertResult.rows[0]);
    }
  } catch (err) {
    console.error('Error updating resume:', err);
    return res.status(500).json({ error: 'Failed to update resume.' });
  }
});

export default router;
