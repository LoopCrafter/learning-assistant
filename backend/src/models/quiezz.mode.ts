import { Schema, model, Document } from "mongoose";
import type { IQuiezz } from "../types/models.js";

const QuiezzSchema: Schema<IQuiezz> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        options: {
          type: [String],
          required: true,
          validate: [
            (val: string[]) => val.length === 4,
            "Must have exactly 4 options",
          ],
        },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        correctAnswer: {
          type: String,
          required: true,
        },
        explanation: {
          type: String,
          default: "",
        },
      },
    ],
    userAnswers: [
      {
        questionIndex: { type: Number, required: true },
        selectedAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        answeredAt: { type: Date, default: Date.now },
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
