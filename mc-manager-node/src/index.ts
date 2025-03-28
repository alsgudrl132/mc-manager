import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database";
import logger from "./utils/logger";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import fileUpload from "express-fileupload";

// 라우터 임포트
import authRoutes from "./routes/authRoutes";
import serverRoutes from "./routes/serverRoutes";
import playerRoutes from "./routes/playerRoutes";
import chatRoutes from "./routes/chatRoutes";
import backupRoutes from "./routes/backupRoutes";

dotenv.config();

// Express 앱 초기화
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

// CORS 설정 - 모든 출처 허용으로 수정
app.use(
  cors({
    origin: true, // 모든 출처 허용 (개발 환경용)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Socket.IO 설정도 수정
const io = new SocketIOServer(server, {
  cors: {
    origin: true, // 모든 출처 허용 (개발 환경용)
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  },
});

// 소켓 연결 처리
io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// API 라우트 설정
app.use("/api/auth", authRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/backups", backupRoutes);

// 건강 체크 엔드포인트
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 데이터베이스 연결 및 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 연결
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");

    // 서버 시작
    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error("Unable to connect to the database or start server:", error);
    process.exit(1);
  }
};

startServer();

// 프로세스 종료 처리
process.on("SIGINT", async () => {
  logger.info("SIGINT signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});

export { io };
