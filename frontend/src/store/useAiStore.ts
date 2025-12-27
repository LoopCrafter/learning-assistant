import type { FlashcardsSet } from "@src/types/flashcard";
import type { Quiz } from "@src/types/quiz";
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
  fetchFlashcardsForDoc: (documentId: string) => Promise<FlashcardsSet[]>;
  generateFlashcard: (documentId: string, count: number) => Promise<void>;
  deleteFlashcardSet: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  reviewFlashcard: (cardId: string) => Promise<void>;
  getQuizzes: (documentId: string) => Promise<Quiz[]>;
  generateQuiz: (documentId: string, numOfQuestions: number) => Promise<Quiz>;
  deleteQuiz: (id: string) => Promise<void>;
};

export const useAiStore = create<AiStore>((set) => ({
  generateSummary: async (documentId: string) => {
    try {
      const response = await Api.post(API_Paths.AI.GENERATE_SUMMARY, {
        documentId,
      });
      return response.data;
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";
      toast.error(message);
      throw error;
    }
  },
  explainConcept: async (documentId: string, concept: string) => {
    try {
      const respose = await Api.post(API_Paths.AI.EXPLAIN_CONCEPT, {
        documentId,
        concept,
      });
      return respose.data;
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";
      toast.error(message);
      throw error;
    }
  },
  fetchFlashcardsForDoc: async (documentId: string) => {
    try {
      const result = await Api(
        API_Paths.FLASHCARDS.GET_FLASHCARDS_FOR_DOCUMENT(documentId)
      );
      return result.data;
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";
      toast.error(message);
      throw error;
    }
  },
  generateFlashcard: async (documentId: string, count: number) => {
    try {
      await Api.post(API_Paths.AI.GENERATE_FLASHCARDS, {
        documentId,
        count,
      });
      toast.success("Flashcards generated successfully");
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";

      toast.error(message);
      throw error;
    }
  },
  deleteFlashcardSet: async (id: string) => {
    try {
      await Api.delete(API_Paths.FLASHCARDS.DELETE_FLASHCARD_SET(id));
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";

      toast.error(message);
      throw error;
    }
  },
  toggleFavorite: async (id: string) => {
    try {
      await Api.put(API_Paths.FLASHCARDS.TOGGLE_STAR(id));
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";

      toast.error(message);
      throw error;
    }
  },
  reviewFlashcard: async (cardId: string) => {
    try {
      await Api.post(API_Paths.FLASHCARDS.REVIEW_FLASHCARD(cardId));
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";

      toast.error(message);
      throw error;
    }
  },
  getQuizzes: async (documentId: string) => {
    try {
      const result = await Api(
        API_Paths.QUIZZES.GET_QUIZZES_FOR_DOCUMENT(documentId)
      );
      return result.data;
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";

      toast.error(message);
      throw error;
    }
  },
  generateQuiz: async (documentId: string, numOfQuestions: number) => {
    try {
      const result = await Api.post(API_Paths.AI.GENERATE_QUIZ, {
        documentId,
        numOfQuestions,
      });
      toast.success("Quiz generated successfully");
      return result.data;
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";

      toast.error(message, errors);
      throw error;
    }
  },
  deleteQuiz: async (id: string) => {
    try {
      await Api.delete(API_Paths.QUIZZES.DELETE_QUIZ(id));
    } catch (error: any) {
      const errors = error?.errors;
      const message =
        errors && typeof errors === "object"
          ? Object.values(errors)[0]
          : error?.message || "Something went wrong";

      toast.error(message);
      throw error;
    }
  },
}));
