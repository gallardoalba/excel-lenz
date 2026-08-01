import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Excel-lenz API',
      version: '0.1.0',
      description: 'REST API for the Excel-lenz interactive learning platform. Provides exercises, courses, gamification, spaced repetition, and community features.',
      contact: { name: 'Excel-lenz Team' },
      license: { name: 'AGPLv3', url: 'https://www.gnu.org/licenses/agpl-3.0.html' },
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Development server' },
      { url: '/api', description: 'Production (behind nginx proxy)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Fehlermeldung' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['student', 'teacher'] },
          },
        },
        Exercise: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            course_id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            instructions: { type: 'string' },
            template_data: { type: 'object' },
            order_index: { type: 'integer' },
          },
        },
        SubmitResult: {
          type: 'object',
          properties: {
            score: { type: 'integer', example: 85 },
            completed: { type: 'boolean' },
            details: { type: 'array', items: { type: 'object' } },
            xpGained: { type: 'integer', example: 50 },
            correctCells: { type: 'integer' },
            totalCells: { type: 'integer' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication & user management' },
      { name: 'Courses', description: 'Course catalog & details' },
      { name: 'Exercises', description: 'Exercise CRUD, submission & scoring' },
      { name: 'Gamification', description: 'XP, badges, streaks & leaderboard' },
      { name: 'Adaptive', description: 'Spaced repetition & skill analysis' },
      { name: 'Community', description: 'Exercise comments & sharing' },
      { name: 'Teacher', description: 'Teacher-only course & student management' },
      { name: 'Enterprise', description: 'Subscriptions, pricing & SCORM export' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
