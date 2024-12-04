import express from "express";
import Redis from "ioredis";

// Initialize the Redis client (reuse the Redis client setup from your main app)
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Function to check if the user session is active (using Redis session storage)
export const checkSession = async (req: express.Request): Promise<boolean> => {
  console.log("Checking session", req.sessionID);

  // If there's no session ID, return false (no session found)
  if (!req.sessionID) {
    return false;
  }

  // Fetch the session from Redis
  try {
    const sessionData = await getSessionFromRedis(req.sessionID);
    if (!sessionData) {
      console.log("No session data found in Redis.");
      return false;
    }

    // Check if the session has a user and is authenticated
    if (sessionData && sessionData.user) {
      req.user = sessionData.user; // Attach user to the request object
      return true;
    }

    console.log("User not authenticated in session.");
    return false;
  } catch (err) {
    console.error("Error checking session in Redis:", err);
    return false;
  }
};

// Helper function to fetch session data from Redis
const getSessionFromRedis = (sessionId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    redisClient.get(sessionId, (err, sessionData) => {
      if (err) {
        reject(err);
      } else {
        resolve(sessionData ? JSON.parse(sessionData) : null);
      }
    });
  });
};

// Function to get the authenticated user's ID from the session
export const getUserFromSession = (req: express.Request): string | null => {
  return req.user ? (req.user as string) : null;
};
