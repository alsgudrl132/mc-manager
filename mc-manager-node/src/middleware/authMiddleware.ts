import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";
import { User } from "../models";
import logger from "../utils/logger";
import dotenv from "dotenv";

// Express Request 타입 확장
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id?: number;
      username?: string;
      role?: string;
      [key: string]: any;
    };
  }
}

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || "your_secret_key_here";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 명시적으로 void 반환 타입 지정
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return; // 명시적 반환
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      role: string;
    };

    if (!decoded || !decoded.id) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
      return; // 명시적 반환
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return; // 명시적 반환
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return; // 명시적 반환
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Token expired",
      });
      return; // 명시적 반환
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
};

export const isModerator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "moderator")
  ) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Moderator access required",
    });
  }
};
