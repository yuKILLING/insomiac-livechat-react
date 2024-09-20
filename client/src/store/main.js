import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMain = create(
  persist(
    (set) => ({
      isAuth: false,
      userInfo: {},
      changeAuth: (authStatus) =>
        set((state) => ({
          isAuth: authStatus,
        })),
      changeUserInfo: (userInfo) =>
        set((state) => ({
          userInfo: userInfo,
        })),
    }),
    {
      name: "user-storage",
    }
  )
);
