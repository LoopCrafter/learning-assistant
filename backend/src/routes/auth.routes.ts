import { Router } from "express";
import { body } from "express-validator";
import {
  changePassword,
  getProfile,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/auth.controllers.js";
import { validate } from "../middleware/validate.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long"),
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
router.post(
  "/change-password",
  protectRoute,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password cannot be empty"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ],
  validate,
  changePassword
);
router.post("/logout", protectRoute, logout);

export default router;
