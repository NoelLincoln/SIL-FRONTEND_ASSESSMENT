import { User } from "@prisma/client";
import { Router } from "express";
import passport from "passport";

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
  (req, res) => {
    // Successful authentication, redirect to home.
    res.redirect(`${frontendUrl}/home`);
  },
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(`${frontendUrl}/`);
  });
});

// Check if the user is logged in and return the user's email
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    // Type assertion to inform TypeScript that req.user is of type `User`
    const user = req.user as User;
    res.json({ email: user.email });
  } else {
    // User is not logged in
    res.status(401).json({ message: "Not authenticated" });
  }
});

export default router;

function next(err: any): void {
  throw new Error("Function not implemented.");
}
