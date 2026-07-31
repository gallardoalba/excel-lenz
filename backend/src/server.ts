import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger';
import { initDb } from './db/database';
import { seed } from './db/seed';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import exerciseRoutes from './routes/exercises';
import teacherRoutes from './routes/teacher';
import gamificationRoutes from './routes/gamification';
import enterpriseRoutes from './routes/enterprise';
import adaptiveRoutes from './routes/adaptive';
import communityRoutes from './routes/community';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Security headers
app.use(helmet({ contentSecurityPolicy: false })); // CSP configured separately if needed

// CORS
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Rate limiting — global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
}));

// Stricter rate limit on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Login-Versuche. Bitte warte 15 Minuten.' },
});

// Initialize database & seed data (idempotent)
initDb();
seed();

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/adaptive', adaptiveRoutes);
app.use('/api/community', communityRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Interner Serverfehler' });
});

// Only start listening if this file is run directly (not imported for tests)
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Excel-lenz backend running on http://localhost:${PORT}`);
  });
}

export default app;
