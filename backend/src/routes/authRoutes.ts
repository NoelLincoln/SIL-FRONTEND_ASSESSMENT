import { Router } from "express";
import passport from "passport";

const router = Router();

// Determine frontend URL based on environment
const frontendUrl =
  process.env.NODE_ENV === "production"
    ? "https://sil-frontend.vercel.app/"
    : "http://localhost:5173";

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: `${frontendUrl}/` }),
  (req, res) => {
    // Successful authentication, redirect to home.
    res.redirect(`${frontendUrl}/home`);
  },
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(`${frontendUrl}/`);
  });
});

export default router;

function next(err: any): void {
  throw new Error("Function not implemented.");
}
