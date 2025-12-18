import type { NextFunction, Request, Response } from "express";

// @desc Get quizzes by document ID
// @route GET /api/quizzes/:documentId
// @access Private
const getQuizzes = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Get quiz by ID
// @route POST /api/quizzes/quiz/:id
// @access Private
const getQuizById = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Submit quiz answers
// @route POST /api/quizzes/:id/submit
// @access Private
const submitQuiz = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Get quiz results
// @route GET /api/quizzes/:id/results
// @access Private
const getQuizResults = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Delete quiz by ID
// @route DELETE /api/quizzes/:id
// @access Private
const deleteQuiz = async (
  req: Request,
  response: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

export { getQuizzes, getQuizById, submitQuiz, getQuizResults, deleteQuiz };
