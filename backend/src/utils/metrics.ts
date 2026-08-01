import client from 'prom-client';

// ── Metrics registry ────────────────────────────────────────

const register = new client.Registry();

// Default metrics are heavy — skip in test environment
const isTest = process.env.NODE_ENV === 'test' || !!process.env.JEST_WORKER_ID;
if (!isTest) {
  client.collectDefaultMetrics({ register, prefix: 'excellenz_' });
}

// ── Custom metrics ──────────────────────────────────────────

export const httpRequestDuration = new client.Histogram({
  name: 'excellenz_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

export const exercisesSubmitted = new client.Counter({
  name: 'excellenz_exercises_submitted_total',
  help: 'Total number of exercise submissions',
  labelNames: ['course_id'],
});

export const usersActive = new client.Gauge({
  name: 'excellenz_users_active',
  help: 'Number of active users in last 7 days',
});

export const exercisesTotal = new client.Gauge({
  name: 'excellenz_exercises_total',
  help: 'Total number of exercises in the system',
});

register.registerMetric(httpRequestDuration);
register.registerMetric(exercisesSubmitted);
register.registerMetric(usersActive);
register.registerMetric(exercisesTotal);

// ── Metrics endpoint handler ────────────────────────────────

export async function metricsHandler(): Promise<string> {
  return register.metrics();
}

export { register };
