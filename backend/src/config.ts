// Centralized configuration constants
// Override via environment variables in production

export const config = {
  // Auth
  auth: {
    tokenExpiry: '24h',
    maxLoginAttempts: 5,
    loginWindowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Server
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    jsonLimit: '2mb',
    trustProxy: true,
  },

  // Rate limiting
  rateLimit: {
    global: { windowMs: 15 * 60 * 1000, max: 500 },
    auth: { windowMs: 15 * 60 * 1000, max: 20 },
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
