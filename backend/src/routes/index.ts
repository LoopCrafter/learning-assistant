import { Router, type Request, type Response } from "express";
import type { ApiResponse } from "../types/response.js";
import UserRoutes from "./users.js";
import AuthRoutes from "./auth.routes.js";
import DocumentRoutes from "./document.routes.js";

const router = Router();
router.use("/users", UserRoutes);
router.use("/auth", AuthRoutes);
router.use("/documents", DocumentRoutes);

router.use((req: Request, res: Response<ApiResponse<undefined>>) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default router;
