import { create } from "zustand";

interface UserI {
  name: string;
  email: string;
}

interface AppI {
  user: UserI;
  setUser: (user: UserI) => void;
}

export const useUserStore = create<AppI>((set) => ({
  user: { name: "", email: "" },
  setUser: (user: UserI) => {
    set({
      user: user,
    });
  },
}));
