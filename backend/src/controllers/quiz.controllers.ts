import type { NextFunction, Request, Response } from "express";
import Quiz from "../models/quiezz.model.js";

// @desc Get quizzes by document ID
// @route GET /api/quizzes/:documentId
// @access Private
const getQuizzes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    if (!documentId) {
      return res.status(400).json({ message: "Document ID is required" });
    }
    const quizzes = await Quiz.find({
      documentId,
      userId: req.user!._id,
    })
      .populate("documentId", "title fieldName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: quizzes,
      message: "Quizzes fetched successfully",
      count: quizzes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get quiz by ID
// @route POST /api/quizzes/quiz/:id
// @access Private
const getQuizById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }
    const quiz = await Quiz.findOne({
      _id: id,
      userId: req.user!._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: quiz,
      message: "Quiz fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Submit quiz answers
// @route POST /api/quizzes/:id/submit
// @access Private
const submitQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answers } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }
    const quiz = await Quiz.findOne({
      _id: id,
      userId: req.user!._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: "Quiz already completed",
      });
    }

    let correctCount = 0;
    let userAnswers: typeof quiz.userAnswers = [];
    answers.forEach(
      (ans: { questionIndex: number; selectedAnswer: string }) => {
        const question = quiz.questions[ans.questionIndex];
        if (question) {
          const isCorrect = question.correctAnswer === ans.selectedAnswer;
          if (isCorrect) correctCount++;
          userAnswers.push({
            questionIndex: ans.questionIndex,
            selectedAnswer: ans.selectedAnswer,
            isCorrect,
            answeredAt: new Date(),
          });
        }
      }
    );

    const score = Math.round((correctCount / quiz.totalQuestions) * 100);
    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completedAt = new Date();
    await quiz.save();

    res.status(200).json({
      success: true,
      data: {
        quiz: quiz._id,
        score,
        totalQuestions: quiz.totalQuestions,
        correctAnswers: correctCount,
        percentage: score,
        userAnswers,
      },
      message: "Quiz submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get quiz results
// @route GET /api/quizzes/:id/results
// @access Private
const getQuizResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }
    const quiz = await Quiz.findOne({
      _id: id,
      userId: req.user!._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }
    if (!quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: "Quiz has not been completed yet",
      });
    }

    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find(
        (ua) => ua.questionIndex === index
      );
      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswer ? userAnswer.selectedAnswer : null,
        isCorrect: userAnswer?.isCorrect || false,
        explanation: question.explanation,
      };
    });
    res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          questions: quiz.questions,
          documentId: quiz.documentId,
          completedAt: quiz.completedAt,
          score: quiz.score,
          totalQuestions: quiz.totalQuestions,
        },
      },
      message: "Quiz results fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete quiz by ID
// @route DELETE /api/quizzes/:id
// @access Private
const deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Quiz ID is required" });
    }
    const quiz = await Quiz.findOneAndDelete({
      _id: id,
      userId: req.user!._id,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { getQuizzes, getQuizById, submitQuiz, getQuizResults, deleteQuiz };
