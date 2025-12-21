import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/progress.controllers.js";

const router = Router();

router.get("/dashboard", protectRoute, getDashboard);

export default router;
