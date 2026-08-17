/**
 * Challenge 1.1.3 — Logger Factory
 * (extra practice rep of the Factory pattern — not in
 * Design_Patterns_Coding_Challenges.md, same shape as Challenge 1.2)
 *
 * An application can log to different destinations.
 *
 * TODO:
 * - `Logger` interface:
 *     `info(message: string): void`
 *     `error(message: string): void`
 * - `ConsoleLogger`, `FileLogger`, `DatabaseLogger` implementing it (the
 *   latter two take a mock destination string via their constructor).
 * - A `createLogger(destination: 'console' | 'file' | 'database'): Logger`
 *   factory function.
 * - `ApplicationService` that asks the factory for a logger *on every call*
 *   (not once at construction), so the destination can vary per call. It
 *   must never instantiate a logger directly.
 *
 * Focus:
 * - Adding a `SlackLogger` later should require changing only the factory
 *   and adding the new implementation.
 */
interface Logger {
  info(message: string): void;
  error(message: string): void;
}

class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(`${message}`);
  }

  error(message: string) {
    console.error(`${message}`);
  }
}

class FileLogger implements Logger {
  constructor(private readonly filePath: string) {}

  info(message: string): void {
    console.log(`[FILE ${this.filePath} INFO]: ${message}`);
  }

  error(message: string): void {
    console.error(`[FILE ${this.filePath} ERROR]: ${message}`);
  }
}

class DatabaseLogger implements Logger {
  constructor(private readonly connectionString: string) {}

  info(message: string): void {
    console.log(`[DB ${this.connectionString} INFO]: ${message}`);
  }

  error(message: string): void {
    console.error(`[DB ${this.connectionString} ERROR]: ${message}`);
  }
}

type LoggerType = 'console' | 'file' | 'database';
type LoggerFactory = (destination: LoggerType) => Logger;

const createLogger: LoggerFactory = (destination) => {
  switch (destination) {
    case 'console':
      return new ConsoleLogger();
    case 'file':
      return new FileLogger('/var/log/app.log');
    case 'database':
      return new DatabaseLogger('mongodb://localhost:27017/logs');
    default:
      throw new Error(`Unsupported logger type: ${destination}`);
  }
};

class ApplicationService {
  constructor(
    private readonly loggerFactory: LoggerFactory,
    private readonly destination: LoggerType,
  ) {}

  log(): void {
    const logger = this.loggerFactory(this.destination);

    if (Math.random() > 0.5) {
      logger.info('Application started standard processing.');
    } else {
      logger.error('Failed to perform task.');
    }
  }
}

const appService = new ApplicationService(createLogger, 'file');

appService.log();
