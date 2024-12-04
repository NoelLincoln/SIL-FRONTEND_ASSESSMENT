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

// Setup Redis client
const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

// Create custom Redis session store
class RedisSessionStore extends session.Store {
  private client: Redis;

  constructor(redisClient: Redis) {
    super();
    this.client = redisClient;
  }

  // Set a session in Redis
  set(sid: string, session: any, callback?: (err?: any) => void): void {
    const ttl = Math.floor(session.cookie.maxAge / 1000); // Session TTL in seconds
    console.log(`Setting session for SID: ${sid} with TTL: ${ttl}s`);
    this.client.setex(sid, ttl, JSON.stringify(session), (err) => {
      if (err) {
        console.error(`Error setting session for SID: ${sid}`, err);
      } else {
        console.log(`Session set for SID: ${sid}`);
      }
      if (callback) {
        callback(err);
      }
    });
  }

  // Get a session from Redis
  get(sid: string, callback: (err: Error | null, session?: any) => void): void {
    console.log(`Fetching session for SID: ${sid}`);
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

  // Implement the destroy method to delete a session from Redis
  destroy(sid: string, callback?: (err?: any) => void): void {
    console.log(`Destroying session for SID: ${sid}`);
    this.client.del(sid, (err) => {
      if (err) {
        console.error(`Error destroying session for SID: ${sid}`, err);
      } else {
        console.log(`Session destroyed for SID: ${sid}`);
      }
      if (callback) {
        callback(err);
      }
    });
  }
}


// Allowed origins for CORS
const allowedOrigins = [
  "https://sil-frontend.vercel.app",
  "http://localhost:5173",
  "https://vercel.live",
  "https://sil-frontend-assessment.onrender.com",
  "http://localhost:4173",
];

// Enable CORS dynamically based on the origin
app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`CORS origin check: ${origin}`);
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.error(`Origin not allowed: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Middleware to parse JSON body
app.use(express.json());

// Session setup using custom Redis store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "vfdfsdc3221",
    resave: false,
    saveUninitialized: false,
    store: new RedisSessionStore(redisClient),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware: Protect specific routes
const ensureAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log(`Checking authentication for request: ${req.user}`);
  const isAuthenticated = await checkSession(req);
  if (isAuthenticated) {
    return next();
  }
  console.log("Unauthorized request");
  res.status(401).json({ error: "Unauthorized" });
};

// Routes for API
app.use("/api/auth", authRoutes);

// Session check route
app.get(
  "/api/check-session",
  async (req: Request, res: Response): Promise<void> => {
    console.log("Checking session status");
    const isAuthenticated = await checkSession(req);
    if (isAuthenticated) {
      console.log("User is logged in");
      res.json({ loggedIn: true, user: req.user });
    } else {
      console.log("User is not logged in");
      res.json({ loggedIn: false });
    }
  }
);

// Protect album and photo routes
app.use("/api/users", ensureAuthenticated, userRoutes);
app.use("/api/albums", ensureAuthenticated, albumRoutes);
app.use("/api/photos", ensureAuthenticated, photoRoutes);

// Global error handler for async errors
app.use((err: Error, req: Request, res: Response) => {
  console.error("Global error handler: ", err);
  res.status(500).json({ error: "Internal server error" });
});

// Set the port and listen
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
