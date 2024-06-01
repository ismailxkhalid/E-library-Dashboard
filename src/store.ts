import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface TokenStore {
  token: string;
  setToken: (newToken: string) => void;
}

const useTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set) => ({
        token: "",
        setToken: (newToken: string) => set({ token: newToken }),
      }),
      { name: "token-store" }
    )
  )
);

export default useTokenStore;
