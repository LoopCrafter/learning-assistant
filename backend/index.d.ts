import * as express from "express";
import type { IUser } from "./src/types/models.ts";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      file?: Express.Multer.File;
    }
  }
}
