import { Router, type Request, type Response } from "express";
import type { ApiResponse } from "../types/response.js";
import UserRoutes from "./users.js";
import AuthRoutes from "./auth.routes.js";
import DocumentRoutes from "./document.routes.js";
import FlashcardRoutes from "./flashcard.routes.js";
import AiRoutes from "./quiz.routes.js";
import QuizRoutes from "./quiz.routes.js";

const router = Router();
router.use("/users", UserRoutes);
router.use("/auth", AuthRoutes);
router.use("/documents", DocumentRoutes);
router.use("/flashcards", FlashcardRoutes);
router.use("/ai", AiRoutes);
router.use("/quizzes", QuizRoutes);

router.use((req: Request, res: Response<ApiResponse<undefined>>) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default router;
