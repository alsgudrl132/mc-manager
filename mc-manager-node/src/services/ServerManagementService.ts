import { promises as fs } from "fs";
import path from "path";
import { spawn, exec } from "child_process";
import util from "util";
import logger from "../utils/logger";
import dotenv from "dotenv";
import rconService from "./RconService";

const execPromise = util.promisify(exec);
dotenv.config();

class ServerManagementService {
  private serverDirectory: string;
  private backupsDirectory: string;

  constructor() {
    this.serverDirectory = process.env.MC_SERVER_DIRECTORY || "";
    this.backupsDirectory = process.env.MC_SERVER_BACKUPS || "";
  }

  async startServer(): Promise<boolean> {
    if (!this.serverDirectory) {
      throw new Error("Server directory is not configured");
    }

    try {
      const platform = process.platform;
      let startCommand: string;

      if (platform === "win32") {
        // Windows
        startCommand = "start.bat";
      } else {
        // Linux/macOS
        startCommand = "./start.sh";
      }

      const startScriptPath = path.join(this.serverDirectory, startCommand);

      // 스크립트 존재 확인 및 실행 권한 확인
      try {
        await fs.access(startScriptPath);

        // Linux/macOS에서 실행 권한 부여
        if (platform !== "win32") {
          await execPromise(`chmod +x ${startScriptPath}`);
        }
      } catch (err) {
        logger.error(`Start script not found: ${startScriptPath}`);
        throw new Error(`Start script not found: ${startCommand}`);
      }

      // 서버 시작 스크립트 실행
      const child = spawn(startScriptPath, [], {
        cwd: this.serverDirectory,
        detached: true,
        stdio: "ignore",
        shell: true,
      });

      child.unref();

      logger.info("Server start command executed");
      return true;
    } catch (error) {
      logger.error("Error starting server:", error);
      throw new Error(`Failed to start server: ${error}`);
    }
  }

  async stopServer(
    userId?: number,
    delay?: number,
    message?: string
  ): Promise<boolean> {
    try {
      logger.info(
        `stopServer called with delay: ${delay}, message: ${message}`
      );

      // 딜레이가 있는 경우
      if (delay && delay > 0) {
        logger.info(`Delay is enabled: ${delay} seconds`);
        if (message) {
          await rconService.broadcastMessage(
            `${message} (${delay}초 후)`,
            userId
          );
          logger.info(`Broadcast message sent: ${message}`);
        }

        // 백그라운드에서 타이머 시작
        logger.info(`Setting timer for ${delay} seconds`);
        setTimeout(async () => {
          try {
            logger.info(`Timer elapsed, executing stop command`);
            // RCON을 통해 서버 중지 명령 전송
            await rconService.stopServer(userId);
            logger.info("Server stop command executed after delay");
          } catch (error) {
            logger.error("Error stopping server after delay:", error);
          }
        }, delay * 1000);

        logger.info(`Server stop scheduled in ${delay} seconds`);
        return true;
      } else {
        logger.info(`No delay or invalid delay, stopping immediately`);
        // 딜레이가 없는 경우 즉시 중지
        await rconService.stopServer(userId);
        logger.info("Server stop command executed immediately");
        return true;
      }
    } catch (error) {
      logger.error("Error stopping server:", error);
      throw new Error(`Failed to stop server: ${error}`);
    }
  }

  async restartServer(
    userId?: number,
    delay?: number,
    message?: string
  ): Promise<boolean> {
    try {
      logger.info(
        `restartServer called with delay: ${delay}, message: ${message}`
      );

      // 딜레이가 있는 경우
      if (delay && delay > 0) {
        logger.info(`Delay is enabled: ${delay} seconds`);
        if (message) {
          await rconService.broadcastMessage(
            `${message} (${delay}초 후)`,
            userId
          );
          logger.info(`Broadcast message sent: ${message}`);
        }

        // 백그라운드에서 타이머 시작
        logger.info(`Setting timer for ${delay} seconds`);
        setTimeout(async () => {
          try {
            logger.info(`Timer elapsed, executing restart sequence`);
            // 서버 중지
            await rconService.stopServer(userId);
            logger.info("Server stop command executed for restart after delay");

            // 서버가 완전히 종료될 때까지 대기
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // 서버 시작
            await this.startServer();
            logger.info("Server restarted successfully after delay");
          } catch (error) {
            logger.error("Error restarting server after delay:", error);
          }
        }, delay * 1000);

        logger.info(`Server restart scheduled in ${delay} seconds`);
        return true;
      } else {
        logger.info(`No delay or invalid delay, restarting immediately`);
        // 딜레이가 없는 경우 즉시 재시작
        // 서버 중지
        await rconService.stopServer(userId);

        // 서버가 완전히 종료될 때까지 대기
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // 서버 시작
        await this.startServer();
        logger.info("Server restarted immediately");
        return true;
      }
    } catch (error) {
      logger.error("Error restarting server:", error);
      throw new Error(`Failed to restart server: ${error}`);
    }
  }

  async restoreBackup(backupId: number, userId: number): Promise<boolean> {
    try {
      const { Backup } = await import("../models");

      // 백업 정보 가져오기
      const backup = await Backup.findByPk(backupId);
      if (!backup) {
        throw new Error(`Backup with ID ${backupId} not found`);
      }

      // 서버 중지
      await this.stopServer(userId);

      // 서버가 완전히 종료될 때까지 대기
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 백업 파일 경로 확인
      const backupPath = backup.path;
      if (!backupPath || !(await fs.stat(backupPath)).isFile()) {
        throw new Error(`Backup file not found: ${backupPath}`);
      }

      // 복원 명령 실행 (unzip 또는 tar 등 환경에 맞게 수정 필요)
      const worldDir = path.join(this.serverDirectory, "world");
      await execPromise(
        `unzip -o "${backupPath}" -d "${this.serverDirectory}"`
      );

      logger.info(`Backup ${backupId} restored successfully`);

      // 서버 재시작
      await this.startServer();

      return true;
    } catch (error) {
      logger.error(`Error restoring backup ${backupId}:`, error);
      throw new Error(`Failed to restore backup: ${error}`);
    }
  }

  async deleteBackup(backupId: number): Promise<boolean> {
    try {
      const { Backup } = await import("../models");

      // 백업 정보 가져오기
      const backup = await Backup.findByPk(backupId);
      if (!backup) {
        throw new Error(`Backup with ID ${backupId} not found`);
      }

      // 파일 삭제
      const backupPath = backup.path;
      if (
        await fs
          .stat(backupPath)
          .then(() => true)
          .catch(() => false)
      ) {
        await fs.unlink(backupPath);
      }

      // DB에서 삭제
      await backup.destroy();

      logger.info(`Backup ${backupId} deleted successfully`);
      return true;
    } catch (error) {
      logger.error(`Error deleting backup ${backupId}:`, error);
      throw new Error(`Failed to delete backup: ${error}`);
    }
  }
}

export default new ServerManagementService();
