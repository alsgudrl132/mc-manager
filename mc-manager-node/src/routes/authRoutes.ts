import { Router } from "express";
import * as authController from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// 사용자 등록
router.post("/register", authController.register);

// 로그인
router.post("/login", authController.login);

// 프로필 조회
router.get("/profile", verifyToken, authController.profile);

export default router;
