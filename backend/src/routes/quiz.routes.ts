import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteQuiz,
  getQuizById,
  getQuizResults,
  getQuizzes,
  submitQuiz,
} from "../controllers/quiz.controllers.js";

const router = Router();
router.use(protectRoute);

router.get("/:documentId", getQuizzes);
router.post("/quiz/:id", getQuizById);
router.post("/:id/submit", submitQuiz);
router.get("/:id/results", getQuizResults);
router.delete("/:id", deleteQuiz);

export default router;
