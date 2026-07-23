import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Route imports
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import projectsRoutes from './routes/projects.js';
import journeyRoutes from './routes/journey.js';
import blogRoutes from './routes/blog.js';
import mediaRoutes from './routes/media.js';
import certificationsRoutes from './routes/certifications.js';
import skillsRoutes from './routes/skills.js';
import publicationsRoutes from './routes/publications.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173', // Vite default dev server
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/certifications', certificationsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/publications', publicationsRoutes);

// Contact message handler (Saves to DB & sends SMTP email)
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields.' });
  }

  try {
    const { query } = await import('./db.js');
    await query(
      `INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)`,
      [name, email, subject || 'No Subject', message]
    );
    console.log(`[DB] Saved contact message from ${name} (${email})`);
  } catch (dbErr) {
    console.error('[DB ERROR] Failed to save message:', dbErr);
  }

  // Print contact message to server log
  console.log(`[CONTACT MESSAGE RECEIVED]
From: ${name} (${email})
Subject: ${subject || 'No Subject'}
Message: ${message}
------------------------------------`);

  // Send email if SMTP is configured in .env
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: process.env.ALLOWED_EMAIL || 'naveenselvaraj.selva@gmail.com',
        replyTo: email,
        subject: `Digital HQ Contact: ${subject || 'Collaboration Inquiry'}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || 'No Subject'}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #1f2937; border-radius: 8px; padding: 20px; background-color: #0b0f19; color: #f3f4f6;">
            <h2 style="color: #06b6d4; border-bottom: 1px solid #1f2937; padding-bottom: 10px;">New Message from Portfolio</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #111827; border-radius: 6px; border: 1px solid #1f2937;">
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            <p style="font-size: 10px; color: #6b7280; margin-top: 20px; text-align: center;">Sourced from your personal digital headquarters console.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[SMTP] Email successfully forwarded to ${process.env.ALLOWED_EMAIL || 'naveenselvaraj.selva@gmail.com'}`);
    } catch (mailErr) {
      console.error('[SMTP ERROR] Failed to send email via SMTP:', mailErr);
    }
  }

  return res.json({ success: true, message: 'Message sent successfully! Thank you.' });
});

// GET /api/contact/messages - Fetch all received messages for Admin Studio
app.get('/api/contact/messages', async (req, res) => {
  try {
    const { query } = await import('./db.js');
    const result = await query(`SELECT * FROM messages ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// DELETE /api/contact/messages/:id - Delete a message by ID
app.delete('/api/contact/messages/:id', async (req, res) => {
  try {
    const { query } = await import('./db.js');
    const { id } = req.params;
    await query(`DELETE FROM messages WHERE id = $1`, [id]);
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

// Serve frontend static build files in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback all non-API GET requests to React Router (SPA index.html)
app.get(/.*/, (req, res) => {
  const file = path.join(distPath, 'index.html');
  res.sendFile(file, (err) => {
    if (err) {
      // In development or if build is not run yet, provide a friendly JSON message
      res.status(200).json({
        message: "Portfolio API is running. Build the frontend ('npm run build') to serve UI here.",
        api_status: "active"
      });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
