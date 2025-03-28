import { Request, Response } from "express";
import monitoringService from "../services/MonitoringService";
import rconService from "../services/RconService";
import logger from "../utils/logger";

export const getPlayerList = async (req: Request, res: Response) => {
  try {
    const players = await monitoringService.getPlayerList();

    res.status(200).json({
      success: true,
      data: players,
    });
  } catch (error: any) {
    logger.error("Get player list error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get player list",
    });
  }
};

export const getPlayerHistory = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;
    const startTime = req.query.startTime
      ? parseInt(req.query.startTime as string)
      : undefined;
    const endTime = req.query.endTime
      ? parseInt(req.query.endTime as string)
      : undefined;

    if (!uuid) {
      res.status(400).json({
        success: false,
        message: "Player UUID is required",
      });
    }

    const history = await monitoringService.getPlayerHistory(
      uuid,
      startTime,
      endTime
    );

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    logger.error("Get player history error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to get player history",
    });
  }
};

export const kickPlayer = async (req: Request, res: Response) => {
  try {
    const { playerName } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;

    if (!playerName) {
      res.status(400).json({
        success: false,
        message: "Player name is required",
      });
    }

    const result = await rconService.kickPlayer(
      playerName,
      reason,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Player ${playerName} has been kicked`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Kick player error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to kick player",
    });
  }
};

export const banPlayer = async (req: Request, res: Response) => {
  try {
    const { playerName } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;

    if (!playerName) {
      res.status(400).json({
        success: false,
        message: "Player name is required",
      });
    }

    const result = await rconService.banPlayer(
      playerName,
      reason,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Player ${playerName} has been banned`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Ban player error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to ban player",
    });
  }
};

export const unbanPlayer = async (req: Request, res: Response) => {
  try {
    const { playerName } = req.params;
    const userId = req.user?.id;

    if (!playerName) {
      res.status(400).json({
        success: false,
        message: "Player name is required",
      });
    }

    const result = await rconService.unbanPlayer(
      playerName,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Player ${playerName} has been unbanned`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Unban player error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to unban player",
    });
  }
};

export const opPlayer = async (req: Request, res: Response) => {
  try {
    const { playerName } = req.params;
    const userId = req.user?.id;

    if (!playerName) {
      res.status(400).json({
        success: false,
        message: "Player name is required",
      });
    }

    const result = await rconService.opPlayer(
      playerName,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Player ${playerName} is now an operator`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Op player error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to op player",
    });
  }
};

export const deopPlayer = async (req: Request, res: Response) => {
  try {
    const { playerName } = req.params;
    const userId = req.user?.id;

    if (!playerName) {
      res.status(400).json({
        success: false,
        message: "Player name is required",
      });
    }

    const result = await rconService.deopPlayer(
      playerName,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Player ${playerName} is no longer an operator`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Deop player error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to deop player",
    });
  }
};

export const teleportPlayer = async (req: Request, res: Response) => {
  try {
    const { playerName } = req.params;
    const { x, y, z, world } = req.body;
    const userId = req.user?.id;

    if (!playerName || x === undefined || y === undefined || z === undefined) {
      res.status(400).json({
        success: false,
        message: "Player name and coordinates (x, y, z) are required",
      });
    }

    const result = await rconService.teleportPlayer(
      playerName,
      x,
      y,
      z,
      world,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Player ${playerName} has been teleported`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Teleport player error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to teleport player",
    });
  }
};

export const setGamemode = async (req: Request, res: Response) => {
  try {
    const { playerName } = req.params;
    const { gamemode } = req.body;
    const userId = req.user?.id;

    if (!playerName || !gamemode) {
      res.status(400).json({
        success: false,
        message: "Player name and gamemode are required",
      });
    }

    const result = await rconService.setGamemode(
      playerName,
      gamemode,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Player ${playerName}'s gamemode has been set to ${gamemode}`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Set gamemode error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to set gamemode",
    });
  }
};

export const giveItem = async (req: Request, res: Response) => {
  try {
    const { playerName } = req.params;
    const { item, amount } = req.body;
    const userId = req.user?.id;

    if (!playerName || !item) {
      res.status(400).json({
        success: false,
        message: "Player name and item are required",
      });
    }

    const result = await rconService.giveItem(
      playerName,
      item,
      amount,
      userId ? Number(userId) : undefined
    );

    res.status(200).json({
      success: true,
      message: `Gave ${amount || 1} ${item} to ${playerName}`,
      data: { response: result },
    });
  } catch (error: any) {
    logger.error("Give item error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to give item",
    });
  }
};
