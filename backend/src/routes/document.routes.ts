import { Router } from "express";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
  uploadDocument,
} from "../controllers/document.controllers.js";

const router = Router();

router.post("/upload", uploadDocument);
router.get("/", getDocuments);
router.get("/:id", getDocumentById);
router.delete("/:id", deleteDocument);
router.put("/:id", updateDocument);

export default router;
