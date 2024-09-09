import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  setToken: (newToken) => set({ token: newToken }),
  clearToken: () => set({ token: null }),
}));

export const useSpaceStore = create((set) => ({
  space: null,
  setSpace: (data) => set({ space: data }),
  clearSpace: () => set({ space: null }),
}));
