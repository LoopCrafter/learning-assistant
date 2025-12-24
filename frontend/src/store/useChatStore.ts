import { RolesEnum, type Message } from "@src/types/chat";
import { API_Paths } from "@src/utils/apiPath";
import Api from "@src/utils/axiosInstance";
import { create } from "zustand";

type ChatStore = {
  getChatHistory: (documentId: string) => Promise<Message[]>;
  chatWithFile: (
    documentId: string,
    question: string
  ) => Promise<Message | undefined>;
};
export const useChatStore = create<ChatStore>()((set, get) => ({
  chats: [],
  getChatHistory: async (documentId: string) => {
    try {
      const result = await Api(API_Paths.AI.GET_CHAT_HISTORY(documentId));
      return result.data;
    } catch (error) {}
  },
  chatWithFile: async (documentId: string, question: string) => {
    try {
      const result = await Api.post(API_Paths.AI.CHAT, {
        documentId,
        question,
      });
      const answer = {
        _id: result.data.chatHistoryId,
        role: RolesEnum.ASSISTANT,
        content: result.data.answer,
        timestamp: new Date().toISOString(),
        releveantChunks: result.data.releveantChunks,
      };
      return answer;
    } catch (error) {
      console.log(error);
    }
  },
}));
