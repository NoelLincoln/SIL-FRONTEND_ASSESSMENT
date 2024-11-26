import { Request, Response } from "express";
import {
  getUsers as getUsersService,
  createUser as createUserService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
  getUserById as getUserByIdService,
  handleGitHubUser as handleGitHubUserService,
} from "../services/userService";

/**
 * Handle GitHub user creation if they don't exist in the database
 */
export const handleGitHubUser = async (profile: any, res: Response) => {
  try {
    const user = await handleGitHubUserService(profile);
    res.status(200).json(user); // Return the user data after processing
  } catch (error) {
    res.status(500).json({ message: "Error processing GitHub user", error });
  }
};

/**
 * Get all users
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getUsersService();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.params.id;
  try {
    const user = await getUserByIdService(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

/**
 * Create a new user
 */
export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { githubId, username, email, name } = req.body;
  try {
    const newUser = await createUserService(githubId, username, email, name);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

/**
 * Update an existing user by ID
 */
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.params.id;
  const { username, email, name } = req.body;

  try {
    const updatedUser = await updateUserService(userId, username, email, name);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.params.id;

  try {
    const deletedUser = await deleteUserService(userId);
    if (deletedUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

/**
 * Get the currently authenticated user (from session)
 */
export const fetchCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (req.isAuthenticated()) {
    res.json(req.user);
    return;
  }
  res.status(401).json({ message: "User is not authenticated" });
};
