import { Router } from "express";
import { Request, Response } from "express";
import { verifyToken, isModerator } from "../middleware/authMiddleware";
import monitoringService from "../services/MonitoringService";
import rconService from "../services/RconService";
import logger from "../utils/logger";

const router = Router();

// 채팅 로그 조회
router.get("/logs", verifyToken, async (req: Request, res: Response) => {
  try {
    const startTime = req.query.startTime
      ? parseInt(req.query.startTime as string)
      : undefined;
    const endTime = req.query.endTime
      ? parseInt(req.query.endTime as string)
      : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const playerUuid = req.query.playerUuid as string;

    const logs = await monitoringService.getChatLogs(
      startTime,
      endTime,
      limit,
      playerUuid
    );

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    logger.error("Get chat logs error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get chat logs",
    });
  }
});

// 전체 메시지 전송
router.post(
  "/broadcast",
  verifyToken,
  isModerator,
  async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      const userId = req.user?.id;

      if (!message) {
        res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      const result = await rconService.broadcastMessage(
        message,
        userId ? Number(userId) : undefined
      );

      res.status(200).json({
        success: true,
        message: "Message broadcast successfully",
        data: { response: result },
      });
    } catch (error: any) {
      logger.error("Broadcast message error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to broadcast message",
      });
    }
  }
);

// 특정 플레이어에게 메시지 전송
router.post(
  "/tell/:playerName",
  verifyToken,
  isModerator,
  async (req: Request, res: Response) => {
    try {
      const { playerName } = req.params;
      const { message } = req.body;
      const userId = req.user?.id;

      if (!playerName || !message) {
        res.status(400).json({
          success: false,
          message: "Player name and message are required",
        });
      }

      const result = await rconService.tellPlayer(
        playerName,
        message,
        userId ? Number(userId) : undefined
      );

      res.status(200).json({
        success: true,
        message: `Message sent to ${playerName}`,
        data: { response: result },
      });
    } catch (error: any) {
      logger.error("Tell player error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to send message",
      });
    }
  }
);

export default router;
