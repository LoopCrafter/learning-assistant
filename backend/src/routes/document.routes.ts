import { Router } from "express";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  uploadDocument,
} from "../controllers/document.controllers.js";
import upload from "../configs/multer.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/upload", upload.single("file"), protectRoute, uploadDocument);
router.get("/", protectRoute, getDocuments);
router.get("/:id", protectRoute, getDocumentById);
router.delete("/:id", protectRoute, deleteDocument);

export default router;
