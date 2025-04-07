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

interface Players {
  uuid: string;
  name: string;
  lastLogin: number;
  playTime: number;
  health: number;
  level: number;
  world: string;
  x: number;
  y: number;
  z: number;
  skinUrl: string;
  isBanned: boolean;
}

interface ServerStatus {
  status: string;
  timestamp: number;
  tps: number;
  onlinePlayers: number;
  maxPlayers: number;
  usedMemory: number;
  totalMemory: number;
  uptime: string;
  players: Players[];
  fetchServer: () => Promise<void>;
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

// 서버 상태 불러오기
export const fetchServerStatus = async () => {
  try {
    return await axios.get(`${URL}/server/status`);
  } catch (error) {
    console.error(`fetchServerStatus Error`, error);
    throw error;
  }
};

export const useServerStateStore = create<ServerStatus>((set) => ({
  // 상태
  status: "",
  timestamp: 0,
  tps: 0,
  onlinePlayers: 0,
  maxPlayers: 0,
  usedMemory: 0,
  totalMemory: 0,
  uptime: "",
  players: [],

  fetchServer: async () => {
    try {
      const response = await fetchServerStatus();

      set({
        status: response.data.data.status,
        timestamp: response.data.data.timestamp,
        tps: response.data.data.tps,
        onlinePlayers: response.data.data.onlinePlayers,
        maxPlayers: response.data.data.maxPlayers,
        usedMemory: response.data.data.usedMemory,
        totalMemory: response.data.data.totalMemory,
        uptime: response.data.data.uptime,
        players: response.data.data.players,
      });
    } catch (error) {
      console.error("fetchServer", error);
    }
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

// 유저 상태 불러오기
export const fetchPlayersStatus = async () => {
  try {
    return await authAxios.get(`${URL}/players`);
  } catch (error) {
    console.error(`fetchPlayersStatus Error`, error);
    throw error;
  }
};

// 유저 킥 또는 벤
export const kickBanPlayer = async (
  name: string,
  option: string,
  reason: string
) => {
  try {
    return await authAxios.post(`${URL}/players/${name}/${option}`, { reason });
  } catch (error) {
    console.error(`kickBanPlayer Error`, error);
    throw error;
  }
};

// 유저 언벤
export const unBanPlayer = async (name: string) => {
  try {
    return await authAxios.post(`${URL}/players/${name}/unban`);
  } catch (error) {
    console.error(`unBanPlayer Error`, error);
    throw error;
  }
};

// 유저 op 또는 deop
export const operatorStatusManage = async (name: string, option: string) => {
  try {
    return await authAxios.post(`${URL}/players/${name}/${option}`);
  } catch (error) {
    console.error(`operatorStatusManage Error`, error);
    throw error;
  }
};

// 유저 게임모드 변경 survival/creative
export const gamemodeManage = async (name: string, option: string) => {
  try {
    return await authAxios.post(`${URL}/players/${name}/gamemode`, {
      gamemode: option,
    });
  } catch (error) {
    console.error(`gamemodeManage Error`, error);
    throw error;
  }
};

// 유저 텔레포트
export const teleportMange = async (name: string, location: object) => {
  try {
    return await authAxios.post(`${URL}/players/${name}/teleport`, location);
  } catch (error) {
    console.error(`teleportMange Error`, error);
    throw error;
  }
};

// 채팅로그 불러오기
export const fetchChatLogs = async () => {
  try {
    return await authAxios.get(`${URL}/chat/logs?includeBanStatus=true`);
  } catch (error) {
    console.error(`fetchChatLogs Error`, error);
    throw error;
  }
};

// 글로벌메세지 보내기
export const sendGlobalMessage = async (message: string) => {
  try {
    return await authAxios.post(`${URL}/chat/broadcast`, { message: message });
  } catch (error) {
    console.error(`sendGlobalMessage Error`, error);
    throw error;
  }
};

// 서버 시작, 중지, 재시작
export const serverStartManage = async (
  option: string,
  delay?: number,
  message?: string
) => {
  try {
    // 요청 본문 구성
    const requestBody: { delay?: number; message?: string } = {};

    // 딜레이가 있는 경우에만 추가
    if (delay && delay > 0) {
      requestBody.delay = delay;
    }

    // 메시지가 있는 경우에만 추가
    if (message && message.trim() !== "") {
      requestBody.message = message;
    }

    console.log(`Sending ${option} request with:`, requestBody);

    // 빈 객체인 경우에도 전송 (서버에서 처리)
    return await authAxios.post(`${URL}/server/${option}`, requestBody);
  } catch (error) {
    console.error(`serverStartManage Error`, error);
    throw error;
  }
};

// 아이템 불러오기
export const getItems = async () => {
  try {
    return await axios.get(`https://minecraft-api.vercel.app/api/items`);
  } catch (error) {
    console.error(`getItems Error`, error);
    throw error;
  }
};

// 아이템 지급하기
export const giveItems = async (name: string, item: string, amount: number) => {
  try {
    return await authAxios.post(`${URL}/players/${name}/give`, {
      item: item,
      amount: amount,
    });
  } catch (error) {
    console.error(`giveItems Error`, error);
    throw error;
  }
};
