import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "./config/passportConfig";
import userRoutes from "./routes/userRoutes";
import albumRoutes from "./routes/albumRoutes";
import photoRoutes from "./routes/photoRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { checkSession } from "../src/utils/sessionUtils"; // Import session utility

const app = express();
const prisma = new PrismaClient();

// Allowed origins for CORS
const allowedOrigins = [
  "https://sil-frontend.vercel.app", // Production URL
  "http://localhost:5173",          // Development URL
];

// Enable CORS dynamically based on the origin
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {return callback(null, true);}
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
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
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware: Protect specific routes
const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (checkSession(req)) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

// Routes for API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);

// Session check route
app.get(
  "/api/check-session",
  ensureAuthenticated,
  async (req: Request, res: Response): Promise<void> => {
    if (checkSession(req)) {
      res.json({ loggedIn: true });
    } else {
      res.json({ loggedIn: false });
    }
  },
);

// Protect album and photo routes
app.use("/api/albums", ensureAuthenticated, albumRoutes);
app.use("/api/photos", ensureAuthenticated, photoRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
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
