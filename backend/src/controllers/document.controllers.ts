import type { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import type { uploadDocumentDto } from "../dtos/document.dto.js";
import type { ApiResponse } from "../types/response.js";
import Document from "../models/document.model.js";
import type { IDocument } from "../types/models.js";
import { processPDF } from "../utils/index.js";

// @desc Upload PDF document
// @route POST /api/documents
// @access Private
const uploadDocument = async (
  req: Request<{}, {}, uploadDocumentDto>,
  res: Response<ApiResponse<IDocument>>,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "please upload a pdf file",
      });
    }

    const { title } = req.body;
    if (!title) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: "please provide a document title",
      });
    }
    const fileUrl = `${process.env.BASE_URL}/uploades/documents/${req.file.filename}`;

    const document = await Document.create({
      userId: req.user!._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl,
      fileSize: req.file.size,
      status: "processing",
    });

    processPDF(document._id.toString(), req.file.path).catch((err) => {
      console.log(err);
    });

    return res.status(201).json({
      success: true,
      message: "document uploaded successfully",
      data: document,
    });
  } catch (error) {
    //clean up uploaded file if there was an error
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    next(error);
  }
};

// @desc Get all documents
// @route GET /api/documents
// @access Private
const getDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Get document by ID
// @route GET /api/documents/:id
// @access Private
const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Delete document
// @route DELETE /api/documents/:id
// @access Private
const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc Update document
// @route PUT /api/documents/:id
// @access Private
const updateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

export {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  updateDocument,
};
