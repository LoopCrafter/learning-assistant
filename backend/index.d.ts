import * as express from "express";
declare global {
  namespace Express {
    interface Request {
      user?: import("../models/user.model").IUser;
      file?: Express.Multer.File;
    }
  }
}
