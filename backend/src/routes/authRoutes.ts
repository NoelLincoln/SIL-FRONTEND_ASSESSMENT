import { User } from "@prisma/client";
import { Router } from "express";
import passport from "passport";
import { handleGitHubUser } from "../services/userService";

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
      const profile = req.user as {
        id: string;
        username: string;
        emails?: { value: string }[]; // From GitHub profile
        displayName: string;
      };

      const githubId = profile.id;
      const email = profile.emails?.[0]?.value || `user-${githubId}@github.com`;
      const name = profile.displayName || profile.username;

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
  }
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
    // Type assertion to inform TypeScript that req.user is of type `User`
    const user = req.user as User;
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

function next(err: any): void {
  throw new Error("Function not implemented.");
}
