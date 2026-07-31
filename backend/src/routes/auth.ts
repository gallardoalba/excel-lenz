import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { getDb } from '../db/database';
import { generateToken, authMiddleware, AuthPayload } from '../middleware/auth';

const router = Router();

// ── Simple in-memory rate limiter for login ──
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

router.post('/register', (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, contraseña y nombre son obligatorios' });
    return;
  }

  // Password strength: min 8 chars, at least one letter and one number
  if (password.length < 8) {
    res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    return;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    res.status(400).json({ error: 'La contraseña debe contener letras y números' });
    return;
  }

  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    // Generic message to prevent email enumeration
    res.status(409).json({ error: 'Registrierung fehlgeschlagen. Überprüfe deine Eingaben.' });
    return;
  }

  const id = uuid();
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
  ).run(id, email, hash, name, 'student');

  const token = generateToken({ userId: id, email, role: 'student' });
  res.status(201).json({ token, user: { id, email, name, role: 'student' } });
});

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Rate limiting
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: 'Zu viele Anmeldeversuche. Bitte warten Sie 15 Minuten.' });
    return;
  }

  if (!email || !password) {
    res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    return;
  }

  const db = getDb();
  const user = db.prepare(
    'SELECT id, email, password_hash, name, role FROM users WHERE email = ?'
  ).get(email) as { id: string; email: string; password_hash: string; name: string; role: string } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: 'Credenciales inválidas' });
    return;
  }

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

router.get('/me', authMiddleware, (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload;
  const db = getDb();
  const user = db.prepare(
    'SELECT id, email, name, role, created_at FROM users WHERE id = ?'
  ).get(userId);

  if (!user) {
    res.status(404).json({ error: 'Usuario no encontrado' });
    return;
  }
  res.json(user);
});

export default router;
