// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import quizRoute from "./routes/quiz.route.js";
import gamificationRoute from "./routes/gamification.route.js";
import recommendationRoute from "./routes/recommendationRoutes.js";

// Setup environment
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Enable logging
app.use(morgan("dev"));

// Built-in middlewares
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

// Static folder for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check route
app.get("/", (req, res) => {
    res.send("Backend API is running 🚀");
});

// Mount API routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/quizzes", quizRoute);
app.use("/api/v1/gamification", gamificationRoute);
app.use("/api/v1/recommendation", recommendationRoute);

// Start server
app.listen(PORT, () => {
    console.log(`\u2705 Server running at http://localhost:${PORT}`);
});
