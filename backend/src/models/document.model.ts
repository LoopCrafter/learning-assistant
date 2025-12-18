import { Schema, model } from "mongoose";
import type { IDocument } from "../types/models.js";

const DocumentSchema: Schema<IDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "please provide a title"],
      trim: true,
      minLength: [3, "title must be at least 3 characters long"],
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    extractedText: {
      type: String,
      default: "",
    },
    chunks: [
      {
        content: {
          type: String,
          required: true,
        },
        pageNumber: {
          type: Number,
          default: 0,
        },
        chunkIndex: {
          type: Number,
          required: true,
        },
      },
    ],
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
    summary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

DocumentSchema.index({ userId: 1, title: 1 }, { unique: true });

const Document = model<IDocument>("Document", DocumentSchema);

export default Document;
