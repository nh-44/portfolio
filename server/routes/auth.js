import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';
const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Fallback for local testing

// Check session status
router.get('/me', (req, res) => {
  const token = req.cookies?.admin_token;
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    return res.json({ authenticated: true, user: verified });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});

// Google Login endpoint
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Credential token is required' });
  }

  try {
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google Client ID is not configured on the server. Please set GOOGLE_CLIENT_ID.' });
    }

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    if (!ALLOWED_EMAIL || email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      console.warn(`Unauthorised login attempt: ${email}`);
      return res.status(403).json({ error: 'Access denied. Your email is not whitelisted as admin.' });
    }

    // Valid admin - issue JWT
    const token = jwt.sign(
      { email: payload.email, name: payload.name, picture: payload.picture },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({ success: true, user: { email: payload.email, name: payload.name, picture: payload.picture } });
  } catch (err) {
    console.error('Google verification error:', err);
    return res.status(401).json({ error: 'Failed to verify Google login token.' });
  }
});

// Fallback Password Login for Local Dev/Testing (when Google Auth is not configured yet)
router.post('/local-login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email: ALLOWED_EMAIL || 'admin@local.dev', name: 'Naveen (Local Admin)' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({ success: true, user: { email: ALLOWED_EMAIL || 'admin@local.dev', name: 'Naveen (Local Admin)' } });
  }

  return res.status(401).json({ error: 'Invalid password.' });
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return res.json({ success: true });
});

export default router;
