// src/routes/userRoutes.ts
import express from "express";
import {
  handleGitHubUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchCurrentUser,
  getUserById,
} from "../controllers/userController";

const router = express.Router();

/**
 * Route to handle GitHub authentication and user creation
 */
router.post("/github", async (req, res) => {
  const profile = req.body; // Assuming you get the GitHub user profile in the request body
  await handleGitHubUser(profile, res);
});

/**
 * Get all users
 */
router.get("/", getUsers);

/**
 * Get user by ID
 */
router.get("/:id", getUserById);

/**
 * Create a new user
 */
router.post("/", createUser);

/**
 * Update user by ID
 */
router.put("/:id", updateUser);

/**
 * Delete a user by ID
 */
router.delete("/:id", deleteUser);

/**
 * Fetch the current authenticated user
 */
router.get("/me", fetchCurrentUser);

export default router;
