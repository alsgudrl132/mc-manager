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

interface IChatFilter {
  limit?: number;
  playerUuid?: string;
  startTime?: number;
  endTime?: number;
}

interface ILocation {
  x: number;
  y: number;
  z: number;
  world?: string;
}

interface ChatState {
  searchTerm: string;
  playerFilter: string;
  limit: number;
  setSearchTerm: (term: string) => void;
  setPlayerFilter: (player: string) => void;
  setLimit: (limit: number) => void;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: async (username, password) => {
    try {
      const response = await axios.post(`${URL}/auth/login`, {
        username,
        password,
      });
      set({ user: response.data.data, token: response.data.data.token });
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },
  register: async (username, email, password) => {
    try {
      await axios.post(`${URL}/auth/register`, {
        username,
        email,
        password,
        role: "admin",
      });
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },
  logout: () => {
    set({ user: null, token: null });
  },
}));

export const useChatStore = create<ChatState>((set) => ({
  searchTerm: "",
  playerFilter: "",
  limit: 100,
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setPlayerFilter: (player: string) => set({ playerFilter: player }),
  setLimit: (limit: number) => set({ limit: limit }),
}));

// 인증이 필요한 요청에 토큰 포함하기
const authAxios = axios.create({
  baseURL: URL,
});

authAxios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const fetchChatLogs = async ({
  limit = 100,
  playerUuid,
  startTime,
  endTime,
}: IChatFilter) => {
  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  if (playerUuid) params.append("playerUuid", playerUuid);
  if (startTime) params.append("startTime", String(startTime));
  if (endTime) params.append("endTime", String(endTime));

  const { data } = await authAxios.get(`/chat/logs?${params}`);
  return data.data;
};

export const fetchServerStatus = async () => {
  const { data } = await authAxios.get(`/server/status`);
  return data.data;
};

export const fetchPlayersList = async () => {
  const { data } = await authAxios.get(`/players`);
  return data.data;
};

export const kickBanPlayer = async (
  playerName: string,
  reason: string,
  option: string
) => {
  try {
    const { data } = await authAxios.post(`/players/${playerName}/${option}`, {
      reason,
    });
    return data;
  } catch (error) {
    console.error(`Error ${option} player:`, error);
    throw error;
  }
};

export const unbanPlayer = async (playerName: string) => {
  try {
    const { data } = await authAxios.post(`/players/${playerName}/unban`);
    return data;
  } catch (error) {
    console.error("Error unbanning player", error);
    throw error;
  }
};

export const opStatusChange = async (playerName: string, option: boolean) => {
  try {
    const endpoint = option ? "op" : "deop";
    const { data } = await authAxios.post(`/players/${playerName}/${endpoint}`);
    return data;
  } catch (error) {
    console.error("Error changing op status", error);
    throw error;
  }
};

export const gamemodeChange = async (playerName: string, option: string) => {
  try {
    const { data } = await authAxios.post(`/players/${playerName}/gamemode`, {
      gamemode: option,
    });
    return data;
  } catch (error) {
    console.error("Error changing gamemode", error);
    throw error;
  }
};

export const teleport = async (playerName: string, location: ILocation) => {
  try {
    const { data } = await authAxios.post(`/players/${playerName}/teleport`, {
      x: location.x,
      y: location.y,
      z: location.z,
      world: location.world,
    });
    return data;
  } catch (error) {
    console.error("Error teleporting", error);
    throw error;
  }
};

export const sendMessage = async (message: string) => {
  try {
    const { data } = await authAxios.post(`/chat/broadcast`, { message });
    return data;
  } catch (error) {
    console.error("Error sending message", error);
    throw error;
  }
};

export const controlServer = async (option: string) => {
  try {
    const { data } = await authAxios.post(`/server/${option}`);
    return data;
  } catch (error) {
    console.error(`Error ${option} server`, error);
    throw error;
  }
};

export const createBackupWorld = async () => {
  try {
    const { data } = await authAxios.post(`/backups`);
    return data;
  } catch (error) {
    console.error("Error creating backup", error);
    throw error;
  }
};

export const useServerStore = create((set) => ({
  serverStatus: null,
  isLoading: true,
  fetchServerStatus: async () => {
    try {
      set({ isLoading: true });
      const { data } = await authAxios.get(`/server/status`);
      set({ serverStatus: data.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching server status", error);
      set({ isLoading: false });
    }
  },
}));
