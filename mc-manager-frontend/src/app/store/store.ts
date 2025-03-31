import { create } from "zustand";
import axios from "axios";

// 현재 브라우저 기반 URL 구성 (개발 환경용)
const BASE_HOST =
  typeof window !== "undefined"
    ? window.location.hostname === "localhost"
      ? "localhost"
      : window.location.hostname
    : "localhost";
const API_PORT = 8080; // 백엔드 포트
const URL = `http://${BASE_HOST}:${API_PORT}/api`;

export interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface ILogin {
  username: string;
  password: string;
}

interface IRegister extends ILogin {
  email: string;
  role: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  token?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    username: string;
    email: string;
    role: string;
    token: string;
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: ILogin) => Promise<LoginResponse>;
  logout: () => void;
}

export const submitRegister = async ({
  username,
  password,
  email,
  role,
}: IRegister) => {
  try {
    const { data } = await axios.post(`${URL}/auth/register`, {
      username,
      password,
      email,
      role,
    });
    return data;
  } catch (error) {
    console.error(`Error Register`, error);
    throw error;
  }
};

export const submitLogin = async ({ username, password }: ILogin) => {
  try {
    const { data } = await axios.post(`${URL}/auth/login`, {
      username,
      password,
    });
    return data;
  } catch (error) {
    console.error(`Error Login`, error);
    throw error;
  }
};

// 로컬 스토리지에서 기존 인증 정보 불러오기
const getStoredAuth = () => {
  if (typeof window === "undefined")
    return { user: null, token: null, isAuthenticated: false };

  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  return {
    token: storedToken,
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedToken,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getStoredAuth(), // 로컬 스토리지에서 초기 상태 불러오기

  login: async (credential) => {
    try {
      const response = await submitLogin(credential);
      if (response.success) {
        // 로컬 스토리지에 토큰과 사용자 정보 저장
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));

        // 상태 업데이트
        set({
          user: response.data,
          token: response.data.token,
          isAuthenticated: true,
        });
      }
      return response; // 결과 반환 추가
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: () => {
    // 로컬 스토리지에서 인증 정보 제거
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 상태 초기화
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

// 인증된 API 요청을 위한 Axios 인스턴스
export const authAxios = axios.create({
  baseURL: URL,
});

// 요청 인터셉터 - 모든 요청에 인증 토큰 추가
authAxios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchServerStatus = async () => {
  try {
    return await axios.get(`${URL}/server/status`);
  } catch (error) {
    console.error(`fetchServerStatus Error`, error);
    throw error;
  }
};
