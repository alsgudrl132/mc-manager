import { Request, Response } from "express";
import monitoringService from "../services/MonitoringService";
import serverManagementService from "../services/ServerManagementService";
import rconService from "../services/RconService";
import logger from "../utils/logger";

export const getServerStatus = async (req: Request, res: Response) => {
  try {
    const status = await monitoringService.getServerStatus();

    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    logger.error("Get server status error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get server status",
    });
  }
};

export const getServerStatusHistory = async (req: Request, res: Response) => {
  try {
    const startTime = req.query.startTime
      ? parseInt(req.query.startTime as string)
      : undefined;
    const endTime = req.query.endTime
      ? parseInt(req.query.endTime as string)
      : undefined;
    const interval = req.query.interval
      ? parseInt(req.query.interval as string)
      : undefined;

    const history = await monitoringService.getServerStatusHistory(
      startTime,
      endTime,
      interval
    );

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    logger.error("Get server status history error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get server status history",
    });
  }
};

export const startServer = async (req: Request, res: Response) => {
  try {
    const result = await serverManagementService.startServer();

    res.status(200).json({
      success: true,
      message: "Server start command executed",
      data: { success: result },
    });
  } catch (error: any) {
    logger.error("Start server error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to start server",
    });
  }
};

export const stopServer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { delay, message } = req.body;

    logger.info(
      `stopServer controller called: delay=${delay}, message=${message}`
    );

    const result = await serverManagementService.stopServer(
      userId ? Number(userId) : undefined,
      delay ? Number(delay) : undefined,
      message
    );

    res.status(200).json({
      success: true,
      message: "Server stop command executed",
      data: { success: result },
    });
  } catch (error: any) {
    logger.error("Stop server error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to stop server",
    });
  }
};

export const restartServer = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { delay, message } = req.body;

    logger.info(
      `restartServer controller called: delay=${delay}, message=${message}`
    );

    const result = await serverManagementService.restartServer(
      userId ? Number(userId) : undefined,
      delay ? Number(delay) : undefined,
      message
    );

    res.status(200).json({
      success: true,
      message: "Server restart command executed",
      data: { success: result },
    });
  } catch (error: any) {
    logger.error("Restart server error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to restart server",
    });
  }
};

export const getServerProperties = async (req: Request, res: Response) => {
  try {
    const properties = await monitoringService.getServerProperties();

    res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error: any) {
    logger.error("Get server properties error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get server properties",
    });
  }
};

export const updateServerProperties = async (req: Request, res: Response) => {
  try {
    const properties = req.body;

    if (!properties || Object.keys(properties).length === 0) {
      res.status(400).json({
        success: false,
        message: "No properties provided",
      });
      return;
    }

    const result = await monitoringService.updateServerProperties(properties);

    res.status(200).json({
      success: true,
      message: "Server properties updated",
      data: { success: result },
    });
  } catch (error: any) {
    logger.error("Update server properties error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update server properties",
    });
  }
};

export const executeCommand = async (req: Request, res: Response) => {
  try {
    const { command } = req.body;
    const userId = req.user?.id;

    if (!command) {
      res.status(400).json({
        success: false,
        message: "Command is required",
      });
      return;
    }

    const result = await rconService.executeCommand(
      command,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: "Command executed",
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Execute command error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to execute command",
    });
  }
};

export const setWeather = async (req: Request, res: Response) => {
  try {
    const { weather } = req.body;
    const userId = req.user?.id;

    // 유효한 날씨 타입 검증
    const validWeatherTypes = ["clear", "rain", "thunder"];
    if (!weather || !validWeatherTypes.includes(weather)) {
      res.status(400).json({
        success: false,
        message: "Invalid weather type. Use 'clear', 'rain', or 'thunder'",
      });
      return;
    }

    // RCON을 통해 날씨 변경 명령 실행
    const result = await rconService.setWeather(
      weather,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Weather changed to ${weather}`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Set weather error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to set weather",
    });
  }
};

export const setTime = async (req: Request, res: Response) => {
  try {
    const { time } = req.body;
    const userId = req.user?.id;

    const validTimes = ["day", "night", "noon", "midnight"];
    const isNumericTime = !isNaN(Number(time));

    if (!time || (!validTimes.includes(time) && !isNumericTime)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid time. Use 'day', 'night', 'noon', 'midnight' or a tick number.",
      });
      return;
    }

    const result = await rconService.executeCommand(
      `time set ${time}`,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Time set to ${time}`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Set time error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to set time",
    });
  }
};
