import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "./config/passportConfig";
import userRoutes from "./routes/userRoutes";
import albumRoutes from "./routes/albumRoutes";
import photoRoutes from "./routes/photoRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

// Enable CORS for the frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies to be sent with requests
  }),
);

// Middleware to parse JSON body
app.use(express.json());

// Session setup
app.use(
  session({
    secret: "vfdfsdc3221",
    resave: false,
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes for API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server, prisma };
