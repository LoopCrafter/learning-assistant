import type { Document, Schema } from "mongoose";

export interface Question {
  question: string;
  options: string[];
  difficulty: string;
  correctAnswer: String;
  explanation?: string;
}

export interface UserAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
  answeredAt: Date;
}

export interface IQuiz extends Document {
  userId: Schema.Types.ObjectId;
  documentId: Schema.Types.ObjectId;
  title: string;
  questions: Question[];
  userAnswers: UserAnswer[];
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
  comparePassword(candidatePassword: string): Promise<boolean>;
}
/**  USER */
