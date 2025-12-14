import { Router } from "express";
import {
  deleteFlashcardSets,
  getAllFlashcardSets,
  getFlashcards,
  revuiewFlashcard,
  toggleStarFlashcard,
} from "../controllers/flashcard.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", protectRoute, getAllFlashcardSets);
router.get("/:documentId", protectRoute, getFlashcards);
router.get("/:cardId/review", protectRoute, revuiewFlashcard);
router.put("/:cardId/start", protectRoute, toggleStarFlashcard);
router.delete("/:id", protectRoute, deleteFlashcardSets);

export default router;
