import type { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import type {
  getDocumentByIdDto,
  uploadDocumentDto,
} from "../dtos/document.dto.js";
import type { ApiResponse, DocumentResponseData } from "../types/response.js";
import Document from "../models/document.model.js";
import type { IDocument } from "../types/models.js";
import { processPDF } from "../utils/index.js";
import { extractTextFromPdf } from "../utils/pdfParser.js";
import Flashcard from "../models/flashcard.model.js";
import Quiz from "../models/quiezz.model.js";

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
    const fileUrl = `${process.env.BASE_URL}/uploads/documents/${req.file.filename}`;

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
  res: Response<ApiResponse<IDocument[]>>,
  next: NextFunction
) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: { userId: req.user!._id },
      },
      {
        $lookup: {
          from: "flashcards",
          localField: "_id",
          foreignField: "documentId",
          as: "flashcardSets",
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "documentId",
          as: "quizzes",
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: "$flashcardSets" },
          quizCount: { $size: "$quizzes" },
        },
      },
      {
        $project: {
          flashcardSets: 0,
          quizzes: 0,
          chunks: 0,
          extractText: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "documents fetched successfully",
      data: documents,
      count: documents.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get document by ID
// @route GET /api/documents/:id
// @access Private
const getDocumentById = async (
  req: Request<getDocumentByIdDto>,
  res: Response<ApiResponse<DocumentResponseData>>,
  next: NextFunction
) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "document not found",
      });
    }

    const flashcardCount = await Flashcard.countDocuments({
      documentId: document!._id,
      userId: req.user!._id,
    });
    const quizCount = await Quiz.countDocuments({
      documentId: document!._id,
      userId: req.user!._id,
    });

    document.lastAccessedAt = new Date();
    await document.save();

    const documentData: any = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;
    return res.status(200).json({
      success: true,
      message: "document fetched successfully",
      data: documentData,
    });
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
