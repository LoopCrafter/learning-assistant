import type { NextFunction, Request, Response } from "express";
import fs from "fs/promises";

// @desc Upload PDF document
// @route POST /api/documents
// @access Private
const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
