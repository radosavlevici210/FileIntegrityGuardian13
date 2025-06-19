
interface LogLevel {
  ERROR: number;
  WARN: number;
  INFO: number;
  DEBUG: number;
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  private logLevel: number;

  constructor() {
    const env = process.env.NODE_ENV || "development";
    this.logLevel = env === "production" ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  private shouldLog(level: number): boolean {
    return level <= this.logLevel;
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      console.error(this.formatMessage("ERROR", message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      console.warn(this.formatMessage("WARN", message, meta));
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      console.log(this.formatMessage("INFO", message, meta));
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      console.log(this.formatMessage("DEBUG", message, meta));
    }
  }

  request(method: string, url: string, statusCode: number, responseTime: number, userAgent?: string): void {
    const meta = {
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      userAgent
    };
    this.info("HTTP Request", meta);
  }
}

export const logger = new Logger();
export default logger;
