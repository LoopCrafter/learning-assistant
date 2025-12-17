import type { NextFunction, Request, Response } from "express";
import Document from "../models/document.model.js";
import { aiServices } from "../utils/geminiService.js";
import Flashcard from "../models/flashcard.model.js";

// @desc Generate flashcards from a document
// @route POST /api/ai/generate-flashcards
// @access Private
const generateFlashcards = async (
  req: Request<{}, {}, { documentId: string; count?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { documentId, count = 10 } = req.body;
    if (!documentId) {
      return res
        .status(400)
        .json({ message: "Document ID is required", success: false });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!._id,
      status: "ready",
    });

    if (!document) {
      return res
        .status(404)
        .json({ message: "Document not found or not ready", success: false });
    }
    //generate Flashcards using AI service
    const cards = await aiServices.generateFlashcards(
      document.extractedText ?? "",
      parseInt(count.toString(), 10)
    );

    const flashcardSets = await Flashcard.create({
      userId: req.user!._id,
      documentId: document._id,
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });
    return res.status(200).json({
      message: "Flashcards generated successfully",
      success: true,
      data: flashcardSets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Generate quiz from a document
// @route POST /api/ai/generate-quiz
// @access Private
const generateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { documentId, numOfQuestions = 5 } = req.body;
    if (!documentId) {
      return res.status(400).json({
        message: "Document ID is required",
        success: false,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        message: "Document not found or not ready",
        success: false,
      });
    }
    const quiz = await aiServices.generateQuizFromText(
      document.extractedText ?? "",
      parseInt(numOfQuestions.toString(), 10)
    );
    return res.status(200).json({
      message: "Quiz generated successfully",
      success: true,
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Generate summary from a document
// @route POST /api/ai/generate-summary
// @access Private
const generateSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Chat with AI about a document
// @route POST /api/ai/chat
// @access Private
const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Explain a concept from a document
// @route POST /api/ai/explain-concept
// @access Private
const explainConcept = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Get chat history for a document
// @route GET /api/ai/chat-history/:documentId
// @access Private
const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

export {
  generateFlashcards,
  generateQuiz,
  generateSummary,
  chat,
  explainConcept,
  getChatHistory,
};
