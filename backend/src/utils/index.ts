import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { StringValue } from "ms";
import { extractTextFromPdf } from "./pdfParser.js";
import { chunkText } from "./textChunker.js";
import Document from "../models/document.model.js";

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as StringValue,
  });
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const processPDF = async (documentId: string, filePath: string) => {
  try {
    const { text } = await extractTextFromPdf(filePath);
    const chunks = chunkText(text, 500, 50);
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: "ready",
    });
    console.log(`PDF document ${documentId} processed successfully.`);
  } catch (error) {
    console.error(`Error processing PDF document ${documentId}:`, error);
    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
};
