import { create } from "zustand";
import Api from "../utils/axiosInstance";
import { API_Paths } from "../utils/apiPath";

type AuthStore = {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  login: async (email: string, password: string) => {
    try {
      const response = await Api.post(API_Paths.AUTH.LOGIN, {
        email,
        password,
      });
      set({ user: response.data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
}));
