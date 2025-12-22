import * as jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

import type { createUserDto, loginUserDto } from "../dtos/auth.dto.js";
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
    const { email, name, password } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User with given email already exists",
      });
    }
    const user = await User.create({ email, name, password });
    generateToken(user._id.toString(), res);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
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
const login = async (
  req: Request<{}, {}, loginUserDto>,
  res: Response<ApiResponse<UserResponseData>>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    generateToken(user._id.toString(), res);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc : Get user profile
// @route : GET /api/auth/profile
// @access : Private
const getProfile = async (
  req: Request,
  res: Response<ApiResponse<UserResponseData>>,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
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
    const { name, email, password, profileImage } = req.body;
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    if (profileImage) user.profileImage = profileImage;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
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
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }
    const user = await User.findById(req.user?._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }
    user.password = newPassword;
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

export { register, login, getProfile, updateProfile, changePassword, logout };
