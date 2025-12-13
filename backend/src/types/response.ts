import type { IUser } from "./models.js";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
};

export type UserResponseData = {
  id: string;
  username: string;
  email: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
};
