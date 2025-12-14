import { Router } from "express";
import {
  deleteFlashcardSets,
  getAllFlashcardSets,
  getFlashcards,
  revuiewFlashcard,
  toggleStarFlashcard,
} from "../controllers/flashcard.controllers.js";

const router = Router();
router.get("/", getAllFlashcardSets);
router.get("/:documentId", getFlashcards);
router.get("/:cardId/review", revuiewFlashcard);
router.put("/:cardId/start", toggleStarFlashcard);
router.delete("/:id", deleteFlashcardSets);

export default router;
