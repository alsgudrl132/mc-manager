import { Request, Response } from "express";
import authService from "../services/AuthService";
import logger from "../utils/logger";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
      return; // return을 사용하되 값은 반환하지 않음
    }

    const userData = await authService.registerUser(
      username,
      email,
      password,
      role
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userData,
    });
  } catch (error: any) {
    logger.error("Register error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
      return; // return 사용, 값은 반환하지 않음
    }

    const userData = await authService.loginUser(username, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: userData,
    });
  } catch (error: any) {
    logger.error("Login error:", error);

    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    // 타입 단언 사용
    const user = (req as any).user;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error("Profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};
