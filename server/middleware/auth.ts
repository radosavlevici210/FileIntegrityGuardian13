
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// JWT token validation middleware (placeholder - integrate with your auth provider)
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
      message: "Access token required"
    });
  }

  try {
    // TODO: Replace with actual JWT verification
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    
    // Placeholder user for development
    req.user = {
      id: "user_123",
      email: "user@example.com",
      role: "user"
    };
    
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: "Forbidden",
      message: "Invalid or expired token"
    });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Authentication required"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Insufficient permissions"
      });
    }

    next();
  };
};
