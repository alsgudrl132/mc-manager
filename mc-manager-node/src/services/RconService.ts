import { Rcon } from "rcon-client";
import logger from "../utils/logger";
import dotenv from "dotenv";
import { CommandLog } from "../models";

dotenv.config();

class RconService {
  private rcon: Rcon | null = null;
  private host: string;
  private port: number;
  private password: string;

  constructor() {
    this.host = process.env.MC_SERVER_IP || "127.0.0.1";
    this.port = parseInt(process.env.MC_RCON_PORT || "25575");
    this.password = process.env.MC_RCON_PASSWORD || "1238546";
  }

  async connect(): Promise<boolean> {
    if (this.rcon && this.rcon.authenticated) return true;

    try {
      this.rcon = await Rcon.connect({
        host: this.host,
        port: this.port,
        password: this.password,
      });

      logger.info("RCON connection established successfully");
      return true;
    } catch (error) {
      logger.error("Failed to connect to RCON:", error);
      this.rcon = null;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.rcon) {
      await this.rcon.end();
      this.rcon = null;
      logger.info("RCON connection closed");
    }
  }

  async executeCommand(command: string, userId?: number): Promise<string> {
    try {
      if (!this.rcon || !this.rcon.authenticated) {
        const connected = await this.connect();
        if (!connected) {
          throw new Error("Failed to connect to RCON server");
        }
      }

      if (!this.rcon) {
        throw new Error("RCON connection failed");
      }

      const response = await this.rcon.send(command);
      logger.info(`RCON command executed: ${command}`);

      // 명령어 로그 기록 (userId가 제공된 경우)
      if (userId) {
        await CommandLog.create({
          timestamp: Date.now(),
          userId,
          command,
          status: "success",
        });
      }

      return response;
    } catch (error) {
      logger.error(`Error executing RCON command: ${command}`, error);

      // 명령어 실패 로그 기록 (userId가 제공된 경우)
      if (userId) {
        await CommandLog.create({
          timestamp: Date.now(),
          userId,
          command,
          status: "failure",
        });
      }

      throw new Error(`Failed to execute command: ${error}`);
    }
  }

  // 플레이어 관련 명령어
  async kickPlayer(
    playerName: string,
    reason: string = "",
    userId?: number
  ): Promise<string> {
    const command = reason
      ? `kick ${playerName} ${reason}`
      : `kick ${playerName}`;
    return this.executeCommand(command, userId);
  }

  async banPlayer(
    playerName: string,
    reason: string = "",
    userId?: number
  ): Promise<string> {
    const command = reason
      ? `ban ${playerName} ${reason}`
      : `ban ${playerName}`;
    return this.executeCommand(command, userId);
  }

  async unbanPlayer(playerName: string, userId?: number): Promise<string> {
    return this.executeCommand(`pardon ${playerName}`, userId);
  }

  async opPlayer(playerName: string, userId?: number): Promise<string> {
    return this.executeCommand(`op ${playerName}`, userId);
  }

  async deopPlayer(playerName: string, userId?: number): Promise<string> {
    return this.executeCommand(`deop ${playerName}`, userId);
  }

  async teleportPlayer(
    playerName: string,
    x: number,
    y: number,
    z: number,
    world: string = "",
    userId?: number
  ): Promise<string> {
    let command = `tp ${playerName} ${x} ${y} ${z}`;
    if (world) {
      command = `execute in ${world} run ${command}`;
    }
    return this.executeCommand(command, userId);
  }

  async setGamemode(
    playerName: string,
    gamemode: string,
    userId?: number
  ): Promise<string> {
    return this.executeCommand(`gamemode ${gamemode} ${playerName}`, userId);
  }

  async giveItem(
    playerName: string,
    item: string,
    amount: number = 1,
    userId?: number
  ): Promise<string> {
    return this.executeCommand(`give ${playerName} ${item} ${amount}`, userId);
  }

  async setXp(
    playerName: string,
    xp: number,
    userId?: number
  ): Promise<string> {
    return this.executeCommand(`xp add ${playerName} ${xp}`, userId);
  }

  // 서버 관리 명령어
  async stopServer(userId?: number): Promise<string> {
    return this.executeCommand("stop", userId);
  }

  async setWeather(weather: string, userId?: number): Promise<string> {
    return this.executeCommand(`weather ${weather}`, userId);
  }

  async setTime(time: string, userId?: number): Promise<string> {
    return this.executeCommand(`time set ${time}`, userId);
  }

  async setDifficulty(difficulty: string, userId?: number): Promise<string> {
    return this.executeCommand(`difficulty ${difficulty}`, userId);
  }

  async broadcastMessage(message: string, userId?: number): Promise<string> {
    return this.executeCommand(`say ${message}`, userId);
  }

  async tellPlayer(
    playerName: string,
    message: string,
    userId?: number
  ): Promise<string> {
    return this.executeCommand(`tell ${playerName} ${message}`, userId);
  }

  async getOnlinePlayers(userId?: number): Promise<string> {
    return this.executeCommand("list", userId);
  }

  // 벤 목록 가져오기
  async getBannedPlayers(userId?: number): Promise<string[]> {
    try {
      const response = await this.executeCommand("banlist", userId);

      // 디버깅을 위해 응답 로깅
      logger.info(`Banlist response: "${response}"`);

      // 응답이 비어있으면 빈 배열 반환
      if (!response) return [];

      // "There are 0 ban(s):" 또는 비슷한 형식이면 빈 배열 반환
      if (response.includes("There are 0 ban")) return [];

      // 형식: "There are X ban(s):name1 was banned by reason, name2 was banned by reason..."
      const bannedPlayers: string[] = [];
      const match = response.match(/There are \d+ ban\(s\):(.*)/);

      if (match && match[1]) {
        // 전체 문자열에서 이름들을 추출
        const bannedInfo = match[1].trim();

        // 각 밴 항목별로 처리 (콤마로 구분된 경우)
        const entries = bannedInfo.split(",");

        for (const entry of entries) {
          // "이름 was banned by ..." 형식에서 이름 추출
          const nameMatch = entry.match(/^(.*?) was banned by/);
          if (nameMatch && nameMatch[1]) {
            bannedPlayers.push(nameMatch[1].trim());
          }
        }
      }

      return bannedPlayers;
    } catch (error) {
      logger.error("Error fetching banned players list:", error);
      return [];
    }
  }
}

export default new RconService();
