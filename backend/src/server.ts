import "dotenv/config";
import express, { urlencoded } from "express";
import router from "./routes/index.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middleware/errorHandler.js";
import connectDB from "./configs/db.js";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
//static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(errorHandler);
app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
