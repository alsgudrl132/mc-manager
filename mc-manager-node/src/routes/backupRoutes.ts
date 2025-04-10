import { Router } from "express";
import { Request, Response } from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware";
import monitoringService from "../services/MonitoringService";
import serverManagementService from "../services/ServerManagementService";
import logger from "../utils/logger";
import fs from "fs";
import path from "path";

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

// 백업 다운로드
router.get(
  "/:id/download",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const backupId = parseInt(req.params.id);

      if (isNaN(backupId)) {
        res.status(400).json({
          success: false,
          message: "Invalid backup ID",
        });
        return;
      }

      // 백업 정보 조회
      const backups = await monitoringService.getBackups();
      const backup = backups.find((b) => b.id === backupId);

      if (!backup) {
        res.status(404).json({
          success: false,
          message: "Backup not found",
        });
        return;
      }

      // 백업 디렉토리 설정
      const backupsDirectory = process.env.MC_SERVER_BACKUPS || "";
      if (!backupsDirectory) {
        res.status(500).json({
          success: false,
          message: "Backup directory is not configured",
        });
        return;
      }

      const backupPath = path.join(backupsDirectory, backup.name);

      // 파일 존재 여부 확인
      if (!fs.existsSync(backupPath)) {
        res.status(404).json({
          success: false,
          message: "Backup file not found on server",
        });
        return;
      }

      // 파일 다운로드 제공
      res.download(backupPath, backup.name, (err) => {
        if (err) {
          logger.error(`Error downloading backup ${backupId}:`, err);

          // 헤더가 이미 전송되었는지 확인
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "Error downloading backup file",
            });
          }
        }
      });
    } catch (error: any) {
      logger.error("Download backup error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to download backup",
      });
    }
  }
);

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
        return;
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
        return;
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

router.get(
  "/:id/download",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const backupId = parseInt(req.params.id);

      if (isNaN(backupId)) {
        res.status(400).json({
          success: false,
          message: "Invalid backup ID",
        });
        return;
      }

      // 백업 정보 가져오기 - 서비스 메서드 사용
      const backup = await monitoringService.getBackupById(backupId);

      if (!backup) {
        res.status(404).json({
          success: false,
          message: "Backup not found",
        });
        return;
      }

      // 파일 존재 여부 확인
      if (!fs.existsSync(backup.path)) {
        res.status(404).json({
          success: false,
          message: "Backup file not found on server",
        });
        return;
      }

      // 파일 다운로드 제공
      res.download(backup.path, backup.name, (err) => {
        if (err) {
          logger.error(`Error downloading backup ${backupId}:`, err);

          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "Error downloading backup file",
            });
          }
        }
      });
    } catch (error: any) {
      logger.error("Download backup error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to download backup",
      });
    }
  }
);

export default router;
