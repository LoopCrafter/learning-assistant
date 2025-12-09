import { Router } from "express";
import { body } from "express-validator";
import {
  changePassword,
  getProfile,
  login,
  register,
  updateProfile,
} from "../controllers/auth.controllers.js";
import { validate } from "../middleware/validate.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("email").isEmail().withMessage("please provide a valid email address"),
  body("password").notEmpty().withMessage("Password cannot be empty"),
];

router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

//protected Routes
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);
router.post("/change-password", protectRoute, changePassword);

export default router;
