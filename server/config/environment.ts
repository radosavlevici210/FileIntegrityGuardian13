
interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  databaseUrl: string;
  corsOrigin: string;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
  };
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue!;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return parsed;
}

export const config: Config = {
  port: getEnvNumber("PORT", 5000),
  nodeEnv: getEnvVar("NODE_ENV", "development"),
  jwtSecret: getEnvVar("JWT_SECRET", "your-secret-key-change-in-production"),
  databaseUrl: getEnvVar("DATABASE_URL", ""),
  corsOrigin: getEnvVar("CORS_ORIGIN", "*"),
  rateLimit: {
    windowMs: getEnvNumber("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000), // 15 minutes
    maxRequests: getEnvNumber("RATE_LIMIT_MAX_REQUESTS", 100)
  },
  upload: {
    maxFileSize: getEnvNumber("MAX_FILE_SIZE", 10 * 1024 * 1024), // 10MB
    allowedTypes: getEnvVar("ALLOWED_FILE_TYPES", "image/jpeg,image/png,image/webp").split(",")
  }
};

export default config;
