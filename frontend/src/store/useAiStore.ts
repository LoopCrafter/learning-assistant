import { API_Paths } from "@src/utils/apiPath";
import Api from "@src/utils/axiosInstance";
import { toast } from "react-toastify";
import { create } from "zustand";

type AiStore = {
  generateSummary: (
    documentId: string
  ) => Promise<{ summary: string; title: string }>;
  explainConcept: (
    documentId: string,
    concept: string
  ) => Promise<{ explaination: string }>;
};

export const useAiStore = create<AiStore>((set) => ({
  generateSummary: async (documentId: string) => {
    try {
      const response = await Api.post(API_Paths.AI.GENERATE_SUMMARY, {
        documentId,
      });
      return response.data;
    } catch (error) {}
  },
  explainConcept: async (documentId: string, concept: string) => {
    try {
      const respose = await Api.post(API_Paths.AI.EXPLAIN_CONCEPT, {
        documentId,
        concept,
      });
      return respose.data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
      }
    }
  },
}));
