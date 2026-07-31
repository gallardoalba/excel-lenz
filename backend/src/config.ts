// Centralized configuration constants
// Override via environment variables in production

const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

export const config = {
  // Auth
  auth: {
    tokenExpiry: '24h',
    maxLoginAttempts: isTest ? 1000 : 5,
    loginWindowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Server
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    jsonLimit: '2mb',
    trustProxy: true,
  },

  // Rate limiting — disabled/high in test environment
  rateLimit: {
    global: { windowMs: 15 * 60 * 1000, max: isTest ? 10000 : 500 },
    auth: { windowMs: 15 * 60 * 1000, max: isTest ? 10000 : 20 },
  },

  // Database
  db: {
    path: process.env.DB_PATH || './data/excel-lenz.db',
    journalMode: 'WAL' as const,
  },

  // Gamification
  gamification: {
    xpPerExercise: 50,
    xpBonus100Percent: 25,
    xpBonus7DayStreak: 100,
    streakTimezone: process.env.STREAK_TIMEZONE || 'Europe/Berlin',
  },
};
