// src/api/minecraft.ts
import api from "@/utils/axios";

export interface ServerStatus {
  tps: number;
  maxPlayers: number;
  onlinePlayers: number;
  ramUsage: {
    total: number;
    formatted: string;
    used: number;
  };
  players: Array<{
    name: string;
    level: number;
    health: number;
    world: string;
    online: boolean;
    skinUrl: string;
  }>;
  uptime: string;
}

export interface ChatLog {
  player: string;
  message: string;
  timestamp: number;
}

export const getServerStatus = async (): Promise<ServerStatus> => {
  const { data } = await api.get<ServerStatus>("/minecraft/status");
  return data;
};

export const getChatLogs = async (): Promise<ChatLog[]> => {
  const { data } = await api.get<ChatLog[]>("/minecraft/chat");
  return data;
};
