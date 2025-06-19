
import express from "express";
import { authenticateToken, requireRole, AuthenticatedRequest } from "../middleware/auth.js";

const router = express.Router();

// Public API routes
router.get("/status", (req, res) => {
  res.json({
    success: true,
    data: {
      service: "RealArtist AI API",
      version: "1.0.0",
      status: "operational",
      timestamp: new Date().toISOString()
    }
  });
});

// Protected user routes
router.get("/profile", authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
      timestamp: new Date().toISOString()
    }
  });
});

// Projects routes with pagination
router.get("/projects", authenticateToken, (req: AuthenticatedRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const offset = (page - 1) * limit;

    // Placeholder data - replace with actual database queries
    const projects = [
      {
        id: "proj_1",
        name: "Sample Project",
        description: "A sample AI art project",
        createdAt: new Date().toISOString(),
        userId: req.user?.id
      }
    ];

    const total = projects.length;
    const paginatedProjects = projects.slice(offset, offset + limit);

    res.json({
      success: true,
      data: paginatedProjects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to fetch projects"
    });
  }
});

// Create project with validation
router.post("/projects", authenticateToken, (req: AuthenticatedRequest, res) => {
  try {
    const { name, description } = req.body;

    // Basic validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        message: "Project name is required"
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        message: "Project name must be less than 100 characters"
      });
    }

    // Create project (placeholder - replace with database logic)
    const newProject = {
      id: `proj_${Date.now()}`,
      name: name.trim(),
      description: description?.trim() || "",
      createdAt: new Date().toISOString(),
      userId: req.user?.id
    };

    res.status(201).json({
      success: true,
      data: newProject,
      message: "Project created successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to create project"
    });
  }
});

// Admin-only routes
router.get("/admin/users", authenticateToken, requireRole(["admin"]), (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    data: {
      users: [],
      message: "Admin endpoint - users list"
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling for undefined routes
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    message: `API endpoint ${req.originalUrl} not found`
  });
});

export default router;
