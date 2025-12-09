import type { NextFunction, Request, Response } from "express";
import type { ApiResponse } from "../types/response.js";

const errorHandler = (
  err: any,
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
) => {
  console.log("🔥 Error Handler Triggered");
  console.log("📌 Error name:", err.name);
  console.log("📌 Error message:", err.message);
  console.log("📌 Error code:", err.code);
  console.log("📌 Error stack:", err.stack);
  let statusCode = 500;
  let message = "Internal Server Error";

  // --------------------------
  // 1. Mongoose: CastError
  // --------------------------
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // --------------------------
  // 2. Duplicate Key Error (11000)
  // --------------------------
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field '${field}'`;
  }

  // --------------------------
  // 3. ValidationError (mongoose)
  // --------------------------
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ");
  }

  // --------------------------
  // 4. Multer: File Size Limit
  // --------------------------
  else if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    message = "File size is too large";
  }

  // --------------------------
  // 5. JWT - Invalid token
  // --------------------------
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  // --------------------------
  // 6. JWT - Expired token
  // --------------------------
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }
  // --------------------------
  // 6. General Error
  // --------------------------
  else if (err.status) {
    statusCode = err.status;
    message = err.message || message;
  }

  // --------------------------
  // 8. Unknown Errors
  // --------------------------
  else {
    message = err.message || message;
  }
};

export default errorHandler;
