import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import passport from "./config/passportConfig";
import userRoutes from "./routes/userRoutes";
import albumRoutes from "./routes/albumRoutes";
import photoRoutes from "./routes/photoRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { checkSession } from "../src/utils/sessionUtils";
import Redis from "ioredis";

const app = express();

// Setup Redis client
const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
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

    this.client.get(sid, (err, existingSession) => {
      if (err) {
        console.error(`Error fetching session for SID: ${sid}`, err);
        return callback?.(err);
      }
      if (existingSession !== JSON.stringify(session)) {
        this.client.setex(sid, ttl, JSON.stringify(session), (err) => {
          if (err) {
            console.error(`Error setting session for SID: ${sid}`, err);
          } else {
            console.log(`Session set for SID: ${sid}`);
          }
          callback?.(err);
        });
      } else {
        console.log(`Session unchanged for SID: ${sid}`);
        callback?.();
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

  // Destroy a session
  destroy(sid: string, callback?: (err?: any) => void): void {
    console.log(`Destroying session for SID: ${sid}`);
    this.client.del(sid, (err) => {
      if (err) {
        console.error(`Error destroying session for SID: ${sid}`, err);
      } else {
        console.log(`Session destroyed for SID: ${sid}`);
      }
      callback?.(err);
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
  }),
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
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware: Protect specific routes
const ensureAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  console.log(`Checking authentication for user: ${req.user}`);
  try {
    const isAuthenticated = await checkSession(req);
    if (isAuthenticated) {
      next(); // Call the next middleware
    } else {
      console.log("User not authenticated");
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    console.error("Error during authentication check:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Routes for API
app.use("/api/auth", authRoutes);

// Session check route
app.get("/api/check-session", async (req: Request, res: Response) => {
  console.log("Checking session status");
  const isAuthenticated = await checkSession(req);
  res.json({
    loggedIn: isAuthenticated,
    user: isAuthenticated ? req.user : null,
  });
});

// Protect album and photo routes
app.use("/api/users", userRoutes);
app.use("/api/albums", ensureAuthenticated, albumRoutes);
app.use("/api/photos", ensureAuthenticated, photoRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error handler: ", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: "Internal server error" });
});

// Set the port and listen
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
