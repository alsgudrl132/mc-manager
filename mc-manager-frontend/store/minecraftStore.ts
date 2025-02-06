// store/serverStore.ts
import { create } from "zustand";
import { ServerStatus, getServerStatus } from "@/api/minecraft";

interface ServerStore {
  status: ServerStatus | null;
  fetchStatus: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useServerStore = create<ServerStore>((set) => ({
  status: null,
  isLoading: false,
  error: null,
  fetchStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await getServerStatus();
      set({ status: data, isLoading: false });
    } catch (error) {
      set({ error: "서버 상태를 불러오는데 실패했습니다", isLoading: false });
      console.error(error);
    }
  },
}));
