import { Schema, model, Document } from "mongoose";
import type { IChatHistory } from "../types/models.js";

const ChatHistorySchema: Schema<IChatHistory> = new Schema(
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
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        conetnt: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        releveantChunks: {
          type: [Number],
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

ChatHistorySchema.index({ userId: 1, documentId: 1 }, { unique: true });
const ChatHistory = model<IChatHistory>("ChatHistory", ChatHistorySchema);
export default ChatHistory;
