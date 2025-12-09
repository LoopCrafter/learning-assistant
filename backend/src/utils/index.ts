import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { StringValue } from "ms";

export const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as StringValue,
  });
  res.cookie("accessToekn", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};
