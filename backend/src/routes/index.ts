import { Router, type Request, type Response } from "express";
import type { ApiResponse } from "../types/response.js";
import AuthRoutes from "./auth.routes.js";
import DocumentRoutes from "./document.routes.js";
import FlashcardRoutes from "./flashcard.routes.js";
import AiRoutes from "./ai.routes.js";
import QuizRoutes from "./quiz.routes.js";
import ProgressRoutes from "./progress.routes.js";

const router = Router();
router.use("/auth", AuthRoutes);
router.use("/documents", DocumentRoutes);
router.use("/flashcards", FlashcardRoutes);
router.use("/ai", AiRoutes);
router.use("/quizzes", QuizRoutes);
router.use("/progress", ProgressRoutes);

router.use((req: Request, res: Response<ApiResponse<undefined>>) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default router;
