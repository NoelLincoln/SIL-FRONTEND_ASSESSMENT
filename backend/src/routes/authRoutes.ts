import express, { Request, Response } from "express";
import passport from "../config/passportConfig"; // Passport configuration
import { handleGitHubUser } from "../controllers/userController"; // Import the user controller

const router = express.Router();

// Route to start GitHub authentication
router.get("/github", passport.authenticate("github"));

// GitHub callback route to handle the redirect after authentication
// router.get(
//   "/github/callback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   async (req: Request, res: Response) => {
//     console.log("github callback",req.body)
//     try {
//       // The authenticated GitHub profile will be attached to req.user
//       const profile = req.user; // Passport adds the user to the request object

//       // Ensure the user is handled in the user service and saved to the database
//       if (profile) {
//         await handleGitHubUser(profile, res); // Ensure this function saves the user to the DB
//       } else {
//         res.status(400).json({ message: "GitHub user profile not found" });
//         return;
//       }

//       // Redirect the user to the home page after successful login
//       res.redirect("/home");
//     } catch (error) {
//       console.error("Error during GitHub callback handling:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   },
// );

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    console.log("github callback", req.body);
    try {
      // The authenticated GitHub profile will be attached to req.user
      const profile = req.user; // Passport adds the user to the request object

      // Ensure the user is handled in the user service and saved to the database
      if (profile) {
        await handleGitHubUser(profile, res); // Ensure this function saves the user to the DB
      } else {
        res.status(400).json({ message: "GitHub user profile not found" });
        return;
      }

      // Redirect the user to the home page after successful login
      res.redirect("/home");
    } catch (error) {
      console.error("Error during GitHub callback handling:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

// Endpoint to check if the user is authenticated
router.get("/status", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

export default router;
