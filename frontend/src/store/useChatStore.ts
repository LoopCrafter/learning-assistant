import { API_Paths } from "@src/utils/apiPath";
import Api from "@src/utils/axiosInstance";
import { create } from "zustand";

type Chat = {};
type ChatStore = {
  chats: Chat[];
  getChatHistory: (documentId: string) => Promise<void>;
};
export const useChatStore = create<ChatStore>()((set, get) => ({
  chats: [],
  getChatHistory: async (documentId: string) => {
    try {
      const result = await Api(API_Paths.AI.GET_CHAT_HISTORY(documentId));
      console.log(result.data);
    } catch (error) {}
  },
}));
