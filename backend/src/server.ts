import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { config } from './config';
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
import analyticsRoutes from './routes/analytics';

const app = express();
const PORT = config.server.port;
const CORS_ORIGIN = config.server.corsOrigin;

// Trust proxy for rate limiting behind nginx/load balancer
if (config.server.trustProxy) {
  app.set('trust proxy', 1);
}

// Security headers
app.use(helmet({ contentSecurityPolicy: false })); // CSP configured separately if needed

// CORS
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: config.server.jsonLimit }));

// Rate limiting — global
app.use(rateLimit({
  windowMs: config.rateLimit.global.windowMs,
  max: config.rateLimit.global.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Zu viele Anfragen. Bitte später erneut versuchen.' },
}));

// Stricter rate limit on auth routes
const authLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
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
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger / OpenAPI docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCss: '.swagger-ui .topbar { display: none }' }));
app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));

// CSRF token endpoint (simple double-submit cookie pattern)
app.get('/api/csrf-token', (_req, res) => {
  const token = require('crypto').randomBytes(32).toString('hex');
  res.cookie('csrf-token', token, { httpOnly: false, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  res.json({ token });
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
