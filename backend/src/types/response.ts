import { Types, type ObjectId } from "mongoose";
import type { IDocument, IFlashcard, IUser } from "./models.js";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
};

export type UserResponseData = {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type IDWithMeta = { _id: ObjectId; __v: number };
export type DocumentResponseData = IDocument &
  IDWithMeta & {
    flashcardCount: number;
    quizCount: number;
  };

export type FlashcardResponse = Omit<IFlashcard, "documentId"> & {
  _id: string;
  documentId: {
    _id: string;
    title: string;
    name: string;
  };
};
