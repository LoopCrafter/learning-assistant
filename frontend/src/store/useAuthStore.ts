import { create } from "zustand";
import Api from "../utils/axiosInstance";
import { API_Paths } from "../utils/apiPath";
import { toast } from "react-toastify";
import type { ErrorMessage } from "../types";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  createdAt: string;
  email: string;
  id: string;
  profileImage: string | null;
  updatedAt: string;
  username: string;
};

type AuthStore = {
  isAuthorized: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthorized: false,
      login: async (email: string, password: string) => {
        try {
          const response = await Api.post(API_Paths.AUTH.LOGIN, {
            email,
            password,
          });

          set({ user: response.data, isAuthorized: true });
        } catch (error: ErrorMessage | any) {
          console.log(error);
          toast.error(error.message || "Something went wrong");
          throw error;
        }
      },
      signup: async (name: string, email: string, password: string) => {
        try {
          const response = await Api.post(API_Paths.AUTH.REGISTER, {
            name,
            email,
            password,
          });
          set({ user: response.data, isAuthorized: true });
        } catch (error: ErrorMessage | any) {
          toast.error(error.message || "Something went wrong");
          throw error;
        }
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
