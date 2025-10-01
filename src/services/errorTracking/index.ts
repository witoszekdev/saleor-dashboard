// @ts-strict-ignore
import { ErrorTrackerFactory } from "./trackerFactory";
import { SentryAdapter } from "./adapters/Sentry";

const errorTracker = ErrorTrackerFactory(
  SentryAdapter({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.ENVIRONMENT,
    release: process.env.RELEASE_NAME,
  }),
);

export { errorTracker };
