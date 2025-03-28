import { Router } from "express";
import * as serverController from "../controllers/serverController";
import {
  verifyToken,
  isAdmin,
  isModerator,
} from "../middleware/authMiddleware";

const router = Router();

// 모든 사용자가 접근 가능한 라우트
router.get("/status", serverController.getServerStatus);
router.get(
  "/status/history",
  verifyToken,
  serverController.getServerStatusHistory
);

// 관리자만 접근 가능한 라우트
router.post("/start", verifyToken, isAdmin, serverController.startServer);
router.post("/stop", verifyToken, isAdmin, serverController.stopServer);
router.post("/restart", verifyToken, isAdmin, serverController.restartServer);
router.get(
  "/properties",
  verifyToken,
  isAdmin,
  serverController.getServerProperties
);
router.put(
  "/properties",
  verifyToken,
  isAdmin,
  serverController.updateServerProperties
);
router.post("/command", verifyToken, isAdmin, serverController.executeCommand);

export default router;
