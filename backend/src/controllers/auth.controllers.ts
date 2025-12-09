import * as jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import type { createUserDto } from "../dtos/auth.dto.js";
import User from "../models/user.model.js";
import type { ApiResponse, UserResponseData } from "../types/response.js";
import type { IUser } from "../types/models.js";
import type { Schema } from "mongoose";
import { generateToken } from "../utils/index.js";

// @desc : Register a new user
// @route : POST /api/auth/register
// @access : Public
const register = async (
  req: Request<{}, {}, createUserDto>,
  res: Response<ApiResponse<UserResponseData>>,
  next: NextFunction
) => {
  try {
    const { email, username, password } = req.body;
    const existUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User with given email or username already exists",
      });
    }
    const user = await User.create({ email, username, password });
    generateToken(user._id.toString(), res);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
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
