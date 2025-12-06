import { Router, type Request, type Response } from "express";
import type { ApiResponss } from "../types/response.js";
import UserRoutes from "./users.js";

const router = Router();
router.use("/users", UserRoutes);

router.use((req: Request, res: Response<ApiResponss<undefined>>) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default router;
