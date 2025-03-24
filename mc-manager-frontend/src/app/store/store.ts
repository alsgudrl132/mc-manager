import { create } from "zustand";
import axios from "axios";

const URL = "http://localhost:8080/api";

interface IChatFilter {
  limit: number;
  player: string;
  search: string;
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
