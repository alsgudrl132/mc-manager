import { create } from "zustand";
import axios from "axios";

const URL = "http://localhost:8080/api";

interface IChatFilter {
  limit: number;
  player: string;
  search: string;
}

interface ILocation {
  x: number;
  y: number;
  z: number;
}

export const useChatStore = create((set) => ({
  searchTerm: "",
  playerFilter: "",
  limit: 50,
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setPlayerFilter: (player: string) => set({ playerFilter: player }),
  setLimit: (limit: number) => set({ limit: limit }),
}));

export const fetchChatLogs = async ({ limit, player, search }: IChatFilter) => {
  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  if (player) params.append("player", player);
  if (search) params.append("search", search);

  const { data } = await axios.get(`${URL}/chat/logs?${params}`);
  return data;
};

export const fetchServerStatus = async () => {
  const { data } = await axios.get(`${URL}/server/status`);
  return data;
};

export const fetchPlayersList = async () => {
  const { data } = await axios.get(`${URL}/players/online/details`);
  return data;
};

export const kickBanPlayer = async (
  uuid: string,
  reason: string,
  option: string
) => {
  try {
    await axios.post(
      `${URL}/players/${uuid}/${option}`,
      {},
      { params: { reason: reason } }
    );
  } catch (error) {
    console.error("Error kicking player:", error);
    throw error;
  }
};

export const unbanPlayer = async (uuid: string) => {
  try {
    await axios.post(`${URL}/players/${uuid}/unban`);
  } catch (error) {
    console.error("Error unbaning player", error);
    throw error;
  }
};

// op 권한 변경
export const opStatusChange = async (uuid: string, option: boolean) => {
  try {
    await axios.post(`${URL}/players/${uuid}/op?value=${option}`);
  } catch (error) {
    console.error("Error opStatusChange", error);
    throw error;
  }
};

// 게임모드 변경
export const gamemodeChange = async (uuid: string, option: string) => {
  try {
    await axios.post(`${URL}/players/${uuid}/gamemode?gamemode=${option}`);
  } catch (error) {
    console.error("Error gamemodeChange", error);
    throw error;
  }
};

// 텔레포트
export const teleport = async (name: string, location: ILocation) => {
  try {
    await axios.post(`${URL}/server/command`, {
      command: `tp ${name} ${location.x} ${location.y} ${location.z}`,
    });
  } catch (error) {
    console.error("Error teleport", error);
    throw error;
  }
};
