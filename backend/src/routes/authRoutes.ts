import { User } from "@prisma/client";
import { Router } from "express";
import passport from "passport";
import { handleGitHubUser } from "../services/userService";

// Extend Express Request to include user type
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      githubId?: string;
      username: string;
    }
  }
}

const router = Router();

// Determine frontend URL based on environment
const frontendUrl =
  process.env.NODE_ENV === "production"
    ? "https://sil-frontend.vercel.app/"
    : "http://localhost:5173";

// GitHub authentication route
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

// GitHub callback route
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: `${frontendUrl}/` }),
  async (req, res) => {
    const prisma = req.app.get("prisma"); // Assuming Prisma is attached to the app instance

    try {
      const profile = req.user as Express.User;

      const githubId = profile.githubId!;
      const email = profile.email || `user-${githubId}@github.com`;
      const name = profile.name || profile.username;

      // Check for an existing user by githubId or email
      let user = await prisma.user.findFirst({
        where: {
          OR: [{ githubId }, { email }],
        },
      });

      // Create a new user only if no user exists
      if (!user) {
        user = await prisma.user.create({
          data: {
            githubId,
            email,
            name,
            username: profile.username,
          },
        });
      }

      // Prepare user info for redirect
      const userInfo = {
        id: user.id,
        username: user.username,
      };
      const queryString = new URLSearchParams(userInfo).toString();

      res.redirect(`${frontendUrl}/home?${queryString}`);
    } catch (error) {
      console.error("Error during GitHub authentication:", error);
      res.redirect(`${frontendUrl}/error`);
    }
  },
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

// Check if the user is logged in and return the user's details
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    // req.user is now typed properly
    const user = req.user!;
    res.json({
      id: user.id,
      email: user.email,
      name: user.name, // Include additional user data if available
    });
  } else {
    // User is not logged in
    res.status(401).json({ message: "Not authenticated" });
  }
});

export default router;
