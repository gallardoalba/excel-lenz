import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const SENTRY_DSN = process.env.SENTRY_DSN;

export function initSentry(): void {
  if (!SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [nodeProfilingIntegration()],
    beforeSend(event) {
      // Sanitize sensitive data
      if (event.request?.cookies) delete event.request.cookies;
      if (event.request?.headers?.['authorization']) {
        event.request.headers['authorization'] = '[Filtered]';
      }
      return event;
    },
  });
}

export { Sentry };
