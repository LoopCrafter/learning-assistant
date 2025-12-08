import * as jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { StringValue } from "ms";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as StringValue,
  });
};

// @desc : Register a new user
// @route : POST /api/auth/register
// @access : Public

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc : Login user
// @route : POST /api/auth/login
// @access : Public
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc : Get user profile
// @route : GET /api/auth/profile
// @access : Private
const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc : Update user profile
// @route : PUT /api/auth/profile
// @access : Private
const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// @desc : Change user password
// @route : POST /api/auth/password
// @access : Private
const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

export { register, login, getProfile, updateProfile, changePassword };
