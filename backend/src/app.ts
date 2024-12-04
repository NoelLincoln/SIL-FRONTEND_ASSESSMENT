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
import Redis from "ioredis";

const app = express();
const prisma = new PrismaClient();

// Setup Redis client
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Create custom Redis session store
class RedisSessionStore extends session.Store {
  private client: Redis;
  
  constructor(redisClient: Redis) {
    super();
    this.client = redisClient;
  }

  // Get a session from Redis
  get(sid: string, callback: (err: Error | null, session?: any) => void): void {
    console.log(`Getting session for SID: ${sid}`);
    this.client.get(sid, (err, result) => {
      if (err) {
        console.error("Error fetching session:", err);
        return callback(err);
      }
      if (!result) {
        console.log(`No session found for SID: ${sid}`);
        return callback(null, null);
      }
      console.log(`Session fetched for SID: ${sid}`);
      return callback(null, JSON.parse(result));
    });
  }

  // Set a session in Redis
  set(sid: string, session: any, callback?: (err?: any) => void): void {
    const ttl = session.cookie.maxAge / 1000; // Session TTL in seconds
    console.log(`Setting session for SID: ${sid} with TTL: ${ttl}s`);
    this.client.setex(sid, ttl, JSON.stringify(session), (err) => {
      if (err) {
        console.error(`Error setting session for SID: ${sid}`, err);
      } else {
        console.log(`Session set for SID: ${sid}`);
      }
      if (callback) {callback(err);}
    });
  }

  // Destroy a session in Redis
  async destroy(sid: string, callback?: (err?: any) => void): Promise<void> {
    console.log(`Destroying session for SID: ${sid}`);
    try {
      await this.client.del(sid);
      console.log(`Session destroyed for SID: ${sid}`);
      if (callback) {callback();}
    } catch (err) {
      console.error(`Error destroying session for SID: ${sid}`, err);
      if (callback) {callback(err);}
    }
  }
}

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
      console.log(`Received request from origin: ${origin}`);
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.error(`Origin not allowed: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Middleware to parse JSON body
app.use(express.json());

// Session setup using custom Redis store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "vfdfsdc3221", // Use environment variable for security
    resave: false,
    saveUninitialized: false, // Don't save uninitialized sessions
    store: new RedisSessionStore(redisClient), // Use the custom Redis store
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
  console.log(`Checking session for user: ${req.user}`);
  if (checkSession(req)) {
    return next();
  }
  console.log("Unauthorized access attempt");
  res.status(401).json({ error: "Unauthorized" });
};

// Routes for API
app.use("/api/auth", authRoutes);

// Session check route
app.get(
  "/api/check-session",
  async (req: Request, res: Response): Promise<void> => {
    console.log("Checking session status");
    if (checkSession(req)) {
      console.log("User is logged in");
      res.json({ loggedIn: true, user: req.user });
    } else {
      console.log("User is not logged in");
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
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  await prisma.$disconnect();
  await redisClient.quit(); // Ensure Redis connection is closed gracefully
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server, prisma };
