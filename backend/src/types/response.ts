import { Types, type ObjectId } from "mongoose";
import type { IDocument, IUser } from "./models.js";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
};

export type UserResponseData = {
  id: string;
  username: string;
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
