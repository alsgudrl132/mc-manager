import { create } from "zustand";
import axios from "axios";
import { devtools, persist } from "zustand/middleware";

// ====================================
// 기본 설정 및 API 엔드포인트 구성
// ====================================
const BASE_HOST =
  typeof window !== "undefined"
    ? window.location.hostname === "localhost"
      ? "localhost"
      : window.location.hostname
    : "localhost";
const API_PORT = 8080;
const URL = `http://${BASE_HOST}:${API_PORT}/api`;

// ====================================
// 타입 및 인터페이스 정의
// ====================================

// 공통 타입
export interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface TimeInterval {
  hours: number;
  minutes: number;
}

// 인증 관련 인터페이스
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

// 서버 상태 관련 인터페이스
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

// 백업 관련 인터페이스
interface BackupStore {
  backupDelayTime: number; // 설정된 백업 간격 (ms)
  currentRemainingTime: number; // 현재 남은 시간 (ms)
  lastUpdated: number; // 마지막 업데이트 시간
  isBackingUp: boolean; // 백업 진행 중 여부
  lastBackupTime: number | null; // 마지막으로 성공한 백업 시간
  setStoreTimeInterval: (timeInterval: TimeInterval) => void;
  updateTimer: () => boolean; // 타이머 업데이트 함수
  performBackup: () => Promise<void>; // 백업 실행 함수
}

// 날씨 관련 인터페이스
export interface Weather {
  weather: "clear" | "rain" | "thunder";
}

// 시간 관련 인터페이스
export interface Time {
  time: "day" | "night";
}

// ====================================
// API 요청 함수
// ====================================

// 인증 관련 API
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

// 서버 상태 API
export const fetchServerStatus = async () => {
  try {
    return await axios.get(`${URL}/server/status`);
  } catch (error) {
    console.error(`fetchServerStatus Error`, error);
    throw error;
  }
};

// 플레이어 관련 API
export const fetchPlayersStatus = async () => {
  try {
    return await authAxios.get(`${URL}/players`);
  } catch (error) {
    console.error(`fetchPlayersStatus Error`, error);
    throw error;
  }
};

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

export const unBanPlayer = async (name: string) => {
  try {
    return await authAxios.post(`${URL}/players/${name}/unban`);
  } catch (error) {
    console.error(`unBanPlayer Error`, error);
    throw error;
  }
};

export const operatorStatusManage = async (name: string, option: string) => {
  try {
    return await authAxios.post(`${URL}/players/${name}/${option}`);
  } catch (error) {
    console.error(`operatorStatusManage Error`, error);
    throw error;
  }
};

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

export const teleportMange = async (name: string, location: object) => {
  try {
    return await authAxios.post(`${URL}/players/${name}/teleport`, location);
  } catch (error) {
    console.error(`teleportMange Error`, error);
    throw error;
  }
};

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

// 채팅 관련 API
export const fetchChatLogs = async () => {
  try {
    return await authAxios.get(`${URL}/chat/logs?includeBanStatus=true`);
  } catch (error) {
    console.error(`fetchChatLogs Error`, error);
    throw error;
  }
};

export const sendGlobalMessage = async (message: string) => {
  try {
    return await authAxios.post(`${URL}/chat/broadcast`, { message: message });
  } catch (error) {
    console.error(`sendGlobalMessage Error`, error);
    throw error;
  }
};

// 서버 관리 API
export const serverStartManage = async (
  option: string,
  delay?: number,
  message?: string
) => {
  try {
    const requestBody: { delay?: number; message?: string } = {};

    if (delay && delay > 0) {
      requestBody.delay = delay;
    }

    if (message && message.trim() !== "") {
      requestBody.message = message;
    }

    console.log(`Sending ${option} request with:`, requestBody);
    return await authAxios.post(`${URL}/server/${option}`, requestBody);
  } catch (error) {
    console.error(`serverStartManage Error`, error);
    throw error;
  }
};

// 백업 API
export const serverBackup = async () => {
  try {
    return await authAxios.post(`${URL}/backups`);
  } catch (error) {
    console.error(`serverBackup Error`, error);
    throw error;
  }
};

// 백업 불러오는 API
export const getBackupList = async () => {
  try {
    return await authAxios.get(`${URL}/backups`);
  } catch (error) {
    console.error(`getBackupList Error`, error);
    throw error;
  }
};

// 백업 다운로드 API
export const downloadBackup = async (id: number) => {
  try {
    return await authAxios.get(`${URL}/backups/${id}/download`, {
      responseType: "blob",
    });
  } catch (error) {
    console.error(`downloadBackup Error`, error);
    throw error;
  }
};

// 아이템 API
export const getItems = async () => {
  try {
    return await axios.get(`https://minecraft-api.vercel.app/api/items`);
  } catch (error) {
    console.error(`getItems Error`, error);
    throw error;
  }
};

// 날씨 지정 API
export const setWeather = async (weather: Weather) => {
  try {
    return await authAxios.post(`${URL}/server/weather`, weather);
  } catch (error) {
    console.error(`setWeather Error`, error);
    throw error;
  }
};

// 시간 지정 API
export const setTime = async (time: Time) => {
  try {
    return await authAxios.post(`${URL}/server/time`, time);
  } catch (error) {
    console.error(`setTime Error`, error);
    throw error;
  }
};

// ====================================
// 헬퍼 함수
// ====================================
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

// ====================================
// 인증된 API용 Axios 인스턴스
// ====================================
export const authAxios = axios.create({
  baseURL: URL,
});

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

// ====================================
// Zustand 스토어
// ====================================

// 인증 스토어
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      ...getStoredAuth(),

      login: async (credential) => {
        try {
          const response = await submitLogin(credential);
          if (response.success) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data));

            set(
              {
                user: response.data,
                token: response.data.token,
                isAuthenticated: true,
              },
              false,
              "login"
            );
          }
          return response;
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        set(
          {
            user: null,
            token: null,
            isAuthenticated: false,
          },
          false,
          "logout"
        );
      },
    }),
    { name: "auth-store" }
  )
);

// 서버 상태 스토어
export const useServerStateStore = create<ServerStatus>()(
  devtools(
    (set) => ({
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

          set(
            {
              status: response.data.data.status,
              timestamp: response.data.data.timestamp,
              tps: response.data.data.tps,
              onlinePlayers: response.data.data.onlinePlayers,
              maxPlayers: response.data.data.maxPlayers,
              usedMemory: response.data.data.usedMemory,
              totalMemory: response.data.data.totalMemory,
              uptime: response.data.data.uptime,
              players: response.data.data.players,
            },
            false,
            "fetchServer"
          );
        } catch (error) {
          console.error("fetchServer", error);
        }
      },
    }),
    { name: "server-store" }
  )
);

// 백업 스토어
export const useBackupStore = create<BackupStore>()(
  devtools(
    persist(
      (set, get) => ({
        backupDelayTime: 9000000, // 기본 2시간 30분
        currentRemainingTime: 9000000,
        lastUpdated: Date.now(),
        isBackingUp: false,
        lastBackupTime: null,

        // 백업 시간 간격 설정
        setStoreTimeInterval: (timeInterval: TimeInterval) => {
          try {
            const newTime =
              (timeInterval.hours * 60 * 60 + timeInterval.minutes * 60) * 1000;
            set(
              {
                backupDelayTime: newTime,
                currentRemainingTime: newTime,
                lastUpdated: Date.now(),
              },
              false,
              "setStoreTimeInterval"
            );
          } catch (error) {
            console.error(`setStoreTimeInterval`, error);
          }
        },

        // 1분마다 타이머 업데이트
        updateTimer: () => {
          const { currentRemainingTime, lastUpdated, isBackingUp } = get();

          const now = Date.now();
          const elapsed = now - lastUpdated;

          // 1분 이상 경과했는지 확인
          if (elapsed >= 60000) {
            const minutesToSubtract = Math.floor(elapsed / 60000);
            const newRemainingTime = Math.max(
              0,
              currentRemainingTime - minutesToSubtract * 60000
            );

            // 남은 시간 업데이트
            set(
              {
                currentRemainingTime: newRemainingTime,
                lastUpdated: now,
              },
              false,
              "updateTimer"
            );

            // 타이머가 0이 되었고 백업 진행 중이 아니면 백업 실행
            if (newRemainingTime === 0 && !isBackingUp) {
              // 백업 실행과 타이머 리셋은 별도 함수로 분리
              get().performBackup();
            }

            return true; // 타이머가 업데이트됨
          }

          return false; // 타이머 업데이트 없음
        },

        // 백업 실행 함수 (독립적으로 분리하여 관리)
        performBackup: async () => {
          const { isBackingUp, backupDelayTime } = get();

          // 이미 백업 중이면 무시
          if (isBackingUp) return;

          // 백업 중 상태로 설정
          set({ isBackingUp: true }, false, "startBackup");

          try {
            console.log("Starting backup process...");
            const result = await serverBackup();

            // 성공 시 타이머 리셋 및 상태 업데이트
            set(
              {
                currentRemainingTime: backupDelayTime,
                lastUpdated: Date.now(),
                isBackingUp: false,
                lastBackupTime: Date.now(),
              },
              false,
              "backupSuccess"
            );

            console.log(
              "Backup completed successfully:",
              result?.data?.message
            );
          } catch (error) {
            console.error("Backup failed:", error);

            // 실패 시에도 타이머 리셋 (무한 재시도 방지)
            set(
              {
                currentRemainingTime: backupDelayTime,
                lastUpdated: Date.now(),
                isBackingUp: false,
              },
              false,
              "backupFailed"
            );
          }
        },
      }),
      {
        name: "backup-storage",
        partialize: (state) => ({
          backupDelayTime: state.backupDelayTime,
          currentRemainingTime: state.currentRemainingTime,
          lastUpdated: state.lastUpdated,
          lastBackupTime: state.lastBackupTime,
        }),
      }
    ),
    { name: "backup-store" }
  )
);
