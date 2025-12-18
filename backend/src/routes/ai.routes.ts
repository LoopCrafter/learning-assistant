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
import { body } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();
router.use(protectRoute);

router.post(
  "/generate-flashcards",
  [
    body("documentId")
      .notEmpty()
      .withMessage("Document ID is required")
      .isMongoId()
      .withMessage("Invalid Document ID"),
    body("count")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Count must be between 1 and 10"),
  ],
  validate,
  generateFlashcards
);
router.post(
  "/generate-quiz",
  [
    body("documentId")
      .notEmpty()
      .withMessage("Document ID is required")
      .isMongoId()
      .withMessage("Invalid Document ID"),
    body("numOfQuestions")
      .optional()
      .default(5)
      .isInt({ min: 1, max: 10 })
      .withMessage("Number of questions must be between 1 and 10"),
  ],
  validate,
  generateQuiz
);
router.post(
  "/generate-summary",
  [
    body("documentId")
      .notEmpty()
      .withMessage("Document ID is required")
      .isMongoId()
      .withMessage("Invalid Document ID"),
  ],
  validate,
  generateSummary
);
router.post(
  "/chat",
  [
    body("documentId")
      .notEmpty()
      .withMessage("Document ID is required")
      .isMongoId()
      .withMessage("Invalid Document ID"),
    body("question")
      .notEmpty()
      .withMessage("Question is required")
      .isString()
      .withMessage("Question must be a string"),
  ],
  validate,
  chat
);
router.post(
  "/explain-concept",
  [
    body("concept")
      .notEmpty()
      .withMessage("Concept is required")
      .isString()
      .withMessage("Concept must be a string"),
    body("documentId")
      .notEmpty()
      .withMessage("Document ID is required")
      .isMongoId()
      .withMessage("Invalid Document ID"),
  ],
  validate,
  explainConcept
);
router.get("/chat-history/:documentId", getChatHistory);

export default router;
