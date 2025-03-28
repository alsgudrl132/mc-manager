import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "minecraft_dashboard",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "1238546",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      freezeTableName: true,
      underscored: false,
    },
  }
);

const initializeDatabase = async () => {
  try {
    await sequelize.sync({
      // force: false로 변경 - 기존 데이터 보존
      force: false,
      // alter: true는 개발 중에만 사용
      alter: process.env.NODE_ENV === "development",
    });

    console.log("데이터베이스 동기화 완료");
  } catch (error) {
    console.error("데이터베이스 동기화 중 오류:", error);
  }
};

// 애플리케이션 시작 시 데이터베이스 초기화 호출
initializeDatabase();

export default sequelize;
