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
  "https://vercel.live",
  "https://sil-frontend-assessment.onrender.com",
  "http://localhost:4173"
];

// Enable CORS dynamically based on the origin
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Middleware to parse JSON body
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "vfdfsdc3221", // Use environment variable for security
    resave: false,
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure this is true in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'lax', // Consider using 'lax' or 'strict' for additional security
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware: Protect specific routes
const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (checkSession(req)) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

// Routes for API
app.use("/api/auth", authRoutes);


// Session check route
app.get(
  "/api/check-session",
  async (req: Request, res: Response): Promise<void> => {
    if (checkSession(req)) {
      res.json({ loggedIn: true, user: req.user });
    } else {
      res.json({ loggedIn: false, user: req.user });
    }
  }
);

// Protect album and photo routes
app.use("/api/users", ensureAuthenticated, userRoutes);
app.use("/api/albums", ensureAuthenticated, albumRoutes);
app.use("/api/photos", ensureAuthenticated, photoRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(500).json({ error: "Internal Server Error" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
});

export { app, server, prisma };
