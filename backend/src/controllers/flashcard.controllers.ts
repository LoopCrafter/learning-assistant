import type { NextFunction, Request, Response } from "express";

// @desc Get all flashcard sets
// @route GET /api/flashcards
// @access Private
const getAllFlashcardSets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Get flashcards for a document
// @route GET /api/flashcards/:documentId
// @access Private
const getFlashcards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Review a flashcard
// @route GET /api/flashcards/:cardId/review
// @access Private
const revuiewFlashcard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
