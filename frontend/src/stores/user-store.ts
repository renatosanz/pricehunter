import { create } from "zustand";

export interface UserI {
  name: string;
  email: string;
  role: string;
  phone: string;
}

interface AppI {
  user: UserI;
  setUser: (user: UserI) => void;
}

export const useUserStore = create<AppI>((set) => ({
  user: { name: " ", email: " ", role: "user", phone: " " },
  setUser: (user: UserI) => {
    set({
      user: user,
    });
  },
}));
