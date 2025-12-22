import type { NextFunction, Request, Response } from "express";
import Document from "../models/document.model.js";
import Flashcard from "../models/flashcard.model.js";
import Quiz from "../models/quiezz.model.js";

// @desc Get dashboard overview
// @route GET /api/progress/dashboard
// @access Private
const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;
    const totalDocuments = await Document.countDocuments({ userId });
    const totalFlashcardSets = await Flashcard.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId });
    const completedQuizzes = await Quiz.countDocuments({
      userId,
      completedAt: { $ne: null },
    });

    // get flashcard statistics
    const flashcardSets = await Flashcard.find({ userId });
    let totalFlashcards = 0;
    let reviewedFlashcards = 0;
    let starredFlashcards = 0;
    flashcardSets.forEach((set) => {
      totalFlashcards += set.cards.length;
      reviewedFlashcards += set.cards.filter(
        (card) => card.reviewCount > 0
      ).length;
      starredFlashcards += set.cards.filter((card) => card.isStarred).length;
    });

    //get Quiz statistics
    const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
    const averageScore =
      quizzes.length > 0
        ? quizzes.reduce((acc, quiz) => acc + quiz.score, 0) / quizzes.length
        : 0;

    // recent activity
    const recentDocuments = await Document.find({ userId })
      .sort({ lastAccessedAt: -1 })
      .limit(5)
      .select("title fileName lastAccessedAt status description");

    const recentQuizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("documentId", "title")
      .select("title score totalQuestions completedAt");

    const studyStrick = Math.floor(Math.random() * 7 + 1);
    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        overview: {
          totalDocuments,
          totalFlashcardSets,
          totalFlashcards,
          reviewedFlashcards,
          starredFlashcards,
          totalQuizzes,
          completedQuizzes,
          averageScore,
          studyStrick,
        },
        recentActivities: {
          documents: recentDocuments,
          quizzes: recentQuizzes,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getDashboard };
