import { Router } from "express";
import {
  deleteFlashcardSets,
  getAllFlashcardSets,
  getFlashcards,
  reviewFlashcard,
  toggleStarFlashcard,
} from "../controllers/flashcard.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protectRoute);
router.get("/", getAllFlashcardSets);
router.get("/:documentId", getFlashcards);
router.post("/:cardId/review", reviewFlashcard);
router.put("/:cardId/star", toggleStarFlashcard);
router.delete("/:id", deleteFlashcardSets);

export default router;
