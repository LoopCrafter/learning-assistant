import type { Types } from "mongoose";
import type { Document, Schema } from "mongoose";

export interface IQuestion {
  question: string;
  options: string[];
  difficulty: string;
  correctAnswer: String;
  explanation?: string;
}

export interface IUserAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
  answeredAt: Date;
}

export interface IQuiz extends Document {
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  title: string;
  questions: IQuestion[];
  userAnswers: IUserAnswer[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

/**  USER */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
/**  USER */

/**  FLASHCARD */
interface ICard {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewdAt: Date | null;
  reviewCount: number;
  isStarred: boolean;
  isCompleted: boolean;
  _id?: Types.ObjectId;
}
export interface IFlashcard {
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  cards: ICard[];
}
/**  FLASHCARD */

/**  DOCUMENT */
interface IChunk {
  content: string;
  pageNumber: number;
  chunkIndex: number;
}
export interface IDocument {
  userId: Types.ObjectId;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  extractedText?: string;
  chunks: IChunk[];
  uploadDate: Date;
  lastAccessedAt: Date;
  status: string;
}

/**  DOCUMENT */

/* ChatHistory */
interface IMessage {
  role: "user" | "assistant";
  conetnt: string;
  timestamp: Date;
  releveantChunks: number[];
}

export interface IChatHistory extends Document {
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}
/* ChatHistory */
