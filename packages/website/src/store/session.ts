import { create } from "zustand";

import type { UserType } from "@root/database/types";

export interface SessionStoreType {
  user?: UserType;
  signIn: (user: UserType) => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionStoreType>((set) => ({
  signIn: (user: UserType) => {
    localStorage.setItem("token", user.token);
    set({ user });
  },
  signOut: () => {
    localStorage.removeItem("token");
    set({ user: undefined });
  },
}));
