import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  chat,
  explainConcept,
  generateFlashcards,
  generateQuiz,
  generateSummary,
  getChatHistory,
} from "../controllers/ai.controllers.js";

const router = Router();
router.use(protectRoute);

router.post("/generate-flashcards", generateFlashcards);
router.post("/generate-quiz", generateQuiz);
router.post("/generate-summary", generateSummary);
router.post("/chat", chat);
router.post("/explain-concept", explainConcept);
router.get("/chat-history/:documentId", getChatHistory);

export default router;
