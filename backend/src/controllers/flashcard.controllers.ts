import type { NextFunction, Request, Response } from "express";
import Flashcard from "../models/flashcard.model.js";
import type { ApiResponse, FlashcardResponse } from "../types/response.js";
import type { IFlashcard } from "../types/models.js";

// @desc Get all flashcard sets
// @route GET /api/flashcards
// @access Private
const getAllFlashcardSets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const flashCards = await Flashcard.find({ userId })
      .populate("documentId", "title name")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      data: flashCards as any,
      count: flashCards.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get flashcards for a document
// @route GET /api/flashcards/:documentId
// @access Private
const getFlashcards = async (
  req: Request<{ documentId: string }>,
  res: Response<ApiResponse<FlashcardResponse[]>>,
  next: NextFunction
) => {
  try {
    const { documentId } = req.params;
    const userId = req.user!._id;
    const flashCards = await Flashcard.find({
      documentId,
      userId,
    })
      .populate("documentId", "title name")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: flashCards as any,
      count: flashCards.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Review a flashcard
// @route GET /api/flashcards/:cardId/review
// @access Private
const revuiewFlashcard = async (
  req: Request<{ cardId: string }>,
  res: Response<ApiResponse<IFlashcard>>,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user!._id;
    const flashcardSet = await Flashcard.findOne({
      "cards._id": cardId,
      userId,
    });
    if (!flashcardSet) {
      return res.status(404).json({
        success: false,
        message: "Flashcard not found",
      });
    }
    const cardIndex: number = flashcardSet.cards.findIndex(
      (card) => card._id?.toString() === cardId
    );

    if (cardIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Card not found in the flashcard set",
      });
    }
    const card = flashcardSet.cards[cardIndex];

    if (card) {
      card.lastReviewdAt = new Date();
      card.reviewCount += 1;
    }
    await flashcardSet.save();

    return res.status(200).json({
      success: true,
      data: flashcardSet,
      message: "Flashcard reviewed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle star on a flashcard
// @route PUT /api/flashcards/:cardId/star
// @access Private
const toggleStarFlashcard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Delete flashcard sets
// @route DELETE /api/flashcards/:id
// @access Private
const deleteFlashcardSets = async (
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
  getAllFlashcardSets,
  getFlashcards,
  revuiewFlashcard,
  toggleStarFlashcard,
  deleteFlashcardSets,
};
