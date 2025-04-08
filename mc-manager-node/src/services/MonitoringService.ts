import { ServerStatus, PlayerData, PlayerStatus, ChatLog } from "../models";
import rconService from "./RconService";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";
import logger from "../utils/logger";
import dotenv from "dotenv";
import { Op } from "sequelize";

const execPromise = util.promisify(exec);
dotenv.config();

class MonitoringService {
  private serverDirectory: string;
  private backupsDirectory: string;

  constructor() {
    this.serverDirectory = process.env.MC_SERVER_DIRECTORY || "";
    this.backupsDirectory = process.env.MC_SERVER_BACKUPS || "";
  }

  async getServerStatus(): Promise<any> {
    try {
      // 데이터베이스에서 최신 서버 상태 조회
      const latestStatus = await ServerStatus.findOne({
        order: [["timestamp", "DESC"]],
      });

      if (!latestStatus) {
        return {
          status: "unknown",
          message: "No server data available",
        };
      }

      // 현재 시간과 비교하여 최근 데이터인지 확인
      const now = Date.now();
      const lastUpdateTime = latestStatus.timestamp;
      const isRecent = now - lastUpdateTime < 60000; // 1분 이내

      // 온라인 플레이어 데이터 조회
      const playerData = await PlayerData.findAll({
        where: { is_online: true },
      });

      const onlinePlayerIds = playerData.map((player) => player.uuid);

      // 온라인 플레이어들의 최신 상태 조회
      let playerStatus: any[] = [];
      if (onlinePlayerIds.length > 0) {
        // 각 플레이어별로 최신 상태를 가져오기
        const promises = onlinePlayerIds.map((uuid) =>
          PlayerStatus.findOne({
            where: { uuid },
            order: [["timestamp", "DESC"]],
          })
        );

        playerStatus = (await Promise.all(promises)).filter(
          (status) => status !== null
        );
      }

      // 벤 목록 가져오기
      const bannedPlayers = await rconService.getBannedPlayers();

      // 플레이어 데이터와 상태 정보 결합
      const players = playerData.map((player) => {
        const status = playerStatus.find(
          (status) => status?.uuid === player.uuid
        );
        return {
          uuid: player.uuid,
          name: player.name,
          lastLogin: player.last_login,
          playTime: player.play_time,
          health: status?.health || 0,
          level: status?.level || 0,
          world: status?.world || "",
          x: status?.x || 0,
          y: status?.y || 0,
          z: status?.z || 0,
          skinUrl: `https://mc-heads.net/avatar/${player.uuid}`,
          isBanned: bannedPlayers.includes(player.name), // 벤 여부 추가
        };
      });

      return {
        status: isRecent ? "online" : "unknown",
        timestamp: latestStatus.timestamp,
        tps: latestStatus.tps,
        onlinePlayers: latestStatus.online_players,
        maxPlayers: latestStatus.max_players,
        usedMemory: latestStatus.used_memory,
        totalMemory: latestStatus.total_memory,
        uptime: latestStatus.uptime,
        players,
      };
    } catch (error) {
      logger.error("Error fetching server status:", error);
      return {
        status: "error",
        message: `Failed to get server status: ${error}`,
      };
    }
  }

  async getServerStatusHistory(
    startTime: number = Date.now() - 86400000, // 기본 24시간
    endTime: number = Date.now(),
    interval: number = 300000 // 5분 간격
  ): Promise<any[]> {
    try {
      // 필터링된 서버 상태 기록 조회
      const statusHistory = await ServerStatus.findAll({
        where: {
          timestamp: {
            [Op.between]: [startTime, endTime],
          },
        },
        order: [["timestamp", "ASC"]],
      });

      // 데이터 포인트 간격 조정
      const sampledData: any[] = [];
      let lastSampleTime = 0;

      statusHistory.forEach((status) => {
        if (status.timestamp - lastSampleTime >= interval) {
          sampledData.push({
            timestamp: status.timestamp,
            tps: status.tps,
            onlinePlayers: status.online_players,
            usedMemory: status.used_memory,
            totalMemory: status.total_memory,
          });
          lastSampleTime = status.timestamp;
        }
      });

      return sampledData;
    } catch (error) {
      logger.error("Error fetching server status history:", error);
      throw new Error(`Failed to get server status history: ${error}`);
    }
  }

  async getPlayerHistory(
    uuid: string,
    startTime: number = Date.now() - 86400000, // 기본 24시간
    endTime: number = Date.now()
  ): Promise<any[]> {
    try {
      // 플레이어의 상태 기록 조회
      const playerStatus = await PlayerStatus.findAll({
        where: {
          uuid,
          timestamp: {
            [Op.between]: [startTime, endTime],
          },
        },
        order: [["timestamp", "ASC"]],
      });

      return playerStatus.map((status) => ({
        timestamp: status.timestamp,
        health: status.health,
        level: status.level,
        world: status.world,
        x: status.x,
        y: status.y,
        z: status.z,
      }));
    } catch (error) {
      logger.error(`Error fetching player history for UUID ${uuid}:`, error);
      throw new Error(`Failed to get player history: ${error}`);
    }
  }

  async getChatLogs(
    startTime: number = Date.now() - 86400000, // 기본 24시간
    endTime: number = Date.now(),
    limit: number = 100,
    playerUuid?: string,
    includeBanStatus: boolean = false
  ): Promise<any[]> {
    try {
      const whereClause: any = {
        timestamp: {
          [Op.between]: [startTime, endTime],
        },
      };

      // 특정 플레이어의 채팅만 필터링
      if (playerUuid) {
        whereClause.uuid = playerUuid;
      }

      // 채팅 로그 조회
      const chatLogs = await ChatLog.findAll({
        where: whereClause,
        order: [["timestamp", "DESC"]],
        limit,
      });

      // 밴 상태 포함 옵션이 활성화된 경우
      if (includeBanStatus && chatLogs.length > 0) {
        // 벤 목록 가져오기
        const bannedPlayers = await rconService.getBannedPlayers();

        // 채팅 로그 매핑 및 벤 상태 추가
        return chatLogs.map((log) => ({
          id: log.id,
          timestamp: log.timestamp,
          uuid: log.uuid,
          playerName: log.player_name,
          message: log.message,
          isBanned: bannedPlayers.includes(log.player_name),
        }));
      }

      // 기본 로그 반환 (벤 상태 없음)
      return chatLogs.map((log) => ({
        id: log.id,
        timestamp: log.timestamp,
        uuid: log.uuid,
        playerName: log.player_name,
        message: log.message,
      }));
    } catch (error) {
      logger.error("Error fetching chat logs:", error);
      throw new Error(`Failed to get chat logs: ${error}`);
    }
  }

  async getServerProperties(): Promise<any> {
    if (!this.serverDirectory) {
      throw new Error("Server directory is not configured");
    }

    const propPath = path.join(this.serverDirectory, "server.properties");

    try {
      // 파일 읽기
      const content = await fs.readFile(propPath, "utf8");
      const properties: any = {};

      // 속성 파싱
      content.split("\n").forEach((line) => {
        if (line && !line.startsWith("#")) {
          const [key, value] = line.split("=").map((part) => part.trim());
          if (key && value !== undefined) {
            properties[key] = value;
          }
        }
      });

      return properties;
    } catch (error) {
      logger.error("Error reading server.properties:", error);
      throw new Error(`Failed to read server properties: ${error}`);
    }
  }

  async updateServerProperties(properties: any): Promise<boolean> {
    if (!this.serverDirectory) {
      throw new Error("Server directory is not configured");
    }

    const propPath = path.join(this.serverDirectory, "server.properties");

    try {
      // 현재 설정 읽기
      const currentContent = await fs.readFile(propPath, "utf8");
      const lines = currentContent.split("\n");
      const updatedLines = lines.map((line) => {
        if (line && !line.startsWith("#")) {
          const [key] = line.split("=").map((part) => part.trim());
          if (key && properties[key] !== undefined) {
            return `${key}=${properties[key]}`;
          }
        }
        return line;
      });

      // 파일 백업
      await fs.copyFile(propPath, `${propPath}.bak`);

      // 업데이트된 내용 저장
      await fs.writeFile(propPath, updatedLines.join("\n"));

      return true;
    } catch (error) {
      logger.error("Error updating server.properties:", error);
      throw new Error(`Failed to update server properties: ${error}`);
    }
  }

  async createBackup(userId: number, description: string = ""): Promise<any> {
    if (!this.serverDirectory || !this.backupsDirectory) {
      throw new Error("Server or backup directory is not configured");
    }

    try {
      // 타임스탬프 생성
      const timestamp = Date.now();
      const dateStr = new Date(timestamp)
        .toISOString()
        .replace(/:/g, "-")
        .replace(/\..+/, "");
      const backupName = `backup_${dateStr}.zip`;
      const backupPath = path.join(this.backupsDirectory, backupName);

      // RCON을 통해 서버에 저장 명령 실행
      await rconService.executeCommand("save-all", userId);

      // 서버가 저장을 완료할 시간을 주기 위해 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 직접 백업 명령 실행 (zip 명령어 사용)
      logger.info(`Creating backup: ${backupPath}`);

      // 서버 디렉토리를 zip 파일로 압축
      await execPromise(
        `zip -r "${backupPath}" "${this.serverDirectory}" -x "${this.serverDirectory}/*cache*" -x "${this.serverDirectory}/*logs*" -x "${this.serverDirectory}/*.jar"`
      );

      // 백업 파일이 생성되었는지 확인
      await fs.access(backupPath);

      // 백업 파일 크기 확인
      const stats = await fs.stat(backupPath);
      const size = stats.size;

      // 백업 정보 데이터베이스에 저장
      const backup = await (
        await import("../models")
      ).Backup.create({
        timestamp,
        name: backupName,
        path: backupPath,
        size,
        userId,
        description,
      });

      return {
        id: backup.id,
        timestamp,
        name: backupName,
        size,
        description,
      };
    } catch (error) {
      logger.error("Error creating backup:", error);
      throw new Error(`Failed to create backup: ${error}`);
    }
  }

  async getBackups(): Promise<any[]> {
    try {
      const backups = await (
        await import("../models")
      ).Backup.findAll({
        order: [["timestamp", "DESC"]],
      });

      return backups.map((backup) => ({
        id: backup.id,
        timestamp: backup.timestamp,
        name: backup.name,
        size: backup.size,
        userId: backup.userId,
        description: backup.description,
      }));
    } catch (error) {
      logger.error("Error fetching backups:", error);
      throw new Error(`Failed to get backups: ${error}`);
    }
  }

  async getPlayerList(): Promise<any[]> {
    try {
      const playerData = await PlayerData.findAll();

      // 벤 목록 가져오기
      const bannedPlayers = await rconService.getBannedPlayers();

      return playerData.map((player) => ({
        uuid: player.uuid,
        name: player.name,
        lastLogin: player.last_login,
        lastLogout: player.last_logout,
        isOnline: player.is_online,
        playTime: player.play_time,
        skinUrl: `https://mc-heads.net/avatar/${player.uuid}`,
        isBanned: bannedPlayers.includes(player.name), // 벤 여부 추가
      }));
    } catch (error) {
      logger.error("Error fetching player list:", error);
      throw new Error(`Failed to get player list: ${error}`);
    }
  }
}

export default new MonitoringService();
