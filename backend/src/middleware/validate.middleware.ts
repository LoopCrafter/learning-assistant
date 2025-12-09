import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMap: { [key: string]: string | string[] } = {};

    errors.array().forEach((error: any) => {
      const { path, msg } = error;
      if (errorMap[path]) {
        if (Array.isArray(errorMap[path])) {
          (errorMap[path] as string[]).push(msg);
        } else {
          errorMap[path] = [errorMap[path] as string, msg];
        }
      } else {
        errorMap[path] = msg;
      }
    });

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMap,
    });
    return;
  }
  next();
};
