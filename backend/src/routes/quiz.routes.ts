import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  deleteQuiz,
  getQuizById,
  getQuizResults,
  getQuizzes,
  submitQuiz,
} from "../controllers/quiz.controllers.js";
import { validate } from "../middleware/validate.middleware.js";
import { body } from "express-validator";

const router = Router();
router.use(protectRoute);

router.get("/:documentId", getQuizzes);
router.post("/quiz/:id", getQuizById);
router.post(
  "/:id/submit",
  [
    body("answers")
      .isArray()
      .withMessage("Answers must be an array")
      .custom((value) => {
        if (value.length === 0) {
          throw new Error("Answers array cannot be empty");
        }
        return true;
      }),
  ],
  validate,
  submitQuiz
);
router.get("/:id/results", getQuizResults);
router.delete("/:id", deleteQuiz);

export default router;
