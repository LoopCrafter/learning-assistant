import { Schema, model } from "mongoose";
import type { IFlashcard } from "../types/models.js";

const FlashcardSchema: Schema<IFlashcard> = new Schema(
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
    cards: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        lastReviewdAt: { type: Date, default: null },
        reviewCount: { type: Number, default: 0 },
        isStarted: { type: Boolean, default: false },
        isCompleted: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

FlashcardSchema.index({ userId: 1, documentId: 1 }, { unique: true });
const Flashcard = model<IFlashcard>("Flashcard", FlashcardSchema);

export default Flashcard;
