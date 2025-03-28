import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Secret, SignOptions } from "jsonwebtoken";
import { User } from "../models";
import logger from "../utils/logger";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || "your_secret_key_here";
const JWT_EXPIRE: string = process.env.JWT_EXPIRE || "24h";

class AuthService {
  async registerUser(
    username: string,
    email: string,
    password: string,
    role: string = "viewer"
  ): Promise<any> {
    try {
      // 이미 존재하는 사용자 확인
      const existingUser = await User.findOne({
        where: {
          [Symbol.for("or")]: [{ username }, { email }],
        },
      });

      if (existingUser) {
        throw new Error("Username or email already exists");
      }

      // 비밀번호 암호화
      const hashedPassword = await bcrypt.hash(password, 10);

      // 사용자 생성
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      // 민감한 정보 제외하고 반환
      const userData = user.get({ plain: true });
      delete userData.password;

      return userData;
    } catch (error) {
      logger.error("Error registering user:", error);
      throw error;
    }
  }

  async loginUser(username: string, password: string): Promise<any> {
    try {
      // 사용자 찾기
      const user = await User.findOne({
        where: { username },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      // 로그인 시간 업데이트
      user.lastLogin = new Date();
      await user.save();

      // JWT 토큰 생성
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE } as SignOptions
      );

      // 민감한 정보 제외하고 반환
      const userData = user.get({ plain: true });
      delete userData.password;

      return {
        ...userData,
        token,
      };
    } catch (error) {
      logger.error("Error logging in:", error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      logger.error("Error validating token:", error);
      throw new Error("Invalid token");
    }
  }
}

export default new AuthService();
