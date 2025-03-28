import { Router } from "express";
import { Request, Response } from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware";
import monitoringService from "../services/MonitoringService";
import serverManagementService from "../services/ServerManagementService";
import logger from "../utils/logger";

const router = Router();

// 백업 목록 조회
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const backups = await monitoringService.getBackups();

    res.status(200).json({
      success: true,
      data: backups,
    });
  } catch (error: any) {
    logger.error("Get backups error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get backups",
    });
  }
});

// 백업 생성
router.post("/", verifyToken, isAdmin, async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    // userId가 undefined일 수 있으므로 검사
    if (!req.user || typeof req.user.id !== "number") {
      res.status(401).json({
        success: false,
        message: "User authentication required",
      });
      return;
    }

    const userId = req.user.id;
    const backup = await monitoringService.createBackup(userId, description);

    res.status(201).json({
      success: true,
      message: "Backup created successfully",
      data: backup,
    });
  } catch (error: any) {
    logger.error("Create backup error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create backup",
    });
  }
});

// 백업 복원
router.post(
  "/:id/restore",
  verifyToken,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const backupId = parseInt(req.params.id);

      if (isNaN(backupId)) {
        res.status(400).json({
          success: false,
          message: "Invalid backup ID",
        });
        return; // 추가: 함수 실행 중단
      }

      // userId가 undefined일 수 있으므로 검사
      if (!req.user || typeof req.user.id !== "number") {
        res.status(401).json({
          success: false,
          message: "User authentication required",
        });
        return;
      }

      const userId = req.user.id;
      const result = await serverManagementService.restoreBackup(
        backupId,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Backup restored successfully",
        data: { success: result },
      });
    } catch (error: any) {
      logger.error("Restore backup error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to restore backup",
      });
    }
  }
);

// 백업 삭제
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      const backupId = parseInt(req.params.id);

      if (isNaN(backupId)) {
        res.status(400).json({
          success: false,
          message: "Invalid backup ID",
        });
        return; // 추가: 함수 실행 중단
      }

      const result = await serverManagementService.deleteBackup(backupId);

      res.status(200).json({
        success: true,
        message: "Backup deleted successfully",
        data: { success: result },
      });
    } catch (error: any) {
      logger.error("Delete backup error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete backup",
      });
    }
  }
);

export default router;
