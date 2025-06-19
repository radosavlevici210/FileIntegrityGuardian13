
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// CORS middleware for API routes
app.use("/api", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", NODE_ENV === "production" ? "https://yourdomain.com" : "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static file serving with cache headers
app.use(express.static(path.join(__dirname, "../dist/public"), {
  maxAge: NODE_ENV === "production" ? "1y" : "0",
  etag: true,
  lastModified: true
}));

// API routes with error handling
app.get("/health", (req, res) => {
  const healthData = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: "1.0.0",
    memory: process.memoryUsage()
  };
  res.json(healthData);
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "RealArtist AI API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API endpoints with validation
app.get("/api/projects", (req, res) => {
  try {
    const projects = [];
    res.json({ 
      success: true,
      data: projects,
      count: projects.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: NODE_ENV === "development" ? error.message : "Something went wrong"
    });
  }
});

// Rate limiting for API routes (simple implementation)
const requestCounts = new Map();
app.use("/api", (req, res, next) => {
  const clientIp = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  if (!requestCounts.has(clientIp)) {
    requestCounts.set(clientIp, { count: 1, resetTime: now + windowMs });
  } else {
    const clientData = requestCounts.get(clientIp);
    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
    } else {
      clientData.count++;
    }

    if (clientData.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later."
      });
    }
  }
  next();
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: NODE_ENV === "development" ? error.message : "Something went wrong"
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: `API endpoint ${req.originalUrl} not found`
  });
});

// Serve React app for all other routes (SPA routing)
app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../dist/public/index.html"));
  } catch (error) {
    console.error("Error serving React app:", error);
    res.status(500).send("Internal server error");
  }
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 RealArtist AI Server running on port ${PORT}`);
  console.log(`📱 Environment: ${NODE_ENV}`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  if (NODE_ENV === "production") {
    console.log(`✅ Production mode - optimized for performance`);
  } else {
    console.log(`🔧 Development mode - verbose logging enabled`);
  }
});
