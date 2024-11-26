// src/controllers/userController.ts
import { Request, Response } from "express";
import { getUserByGitHubId, createUser } from "../services/userService";

/**
 * Get the currently authenticated user
 */
export const fetchCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (req.isAuthenticated()) {
    res.json(req.user);
    return;
  }
  res.status(401).json({ message: "User is not authenticated" }); // Unauthorized if not authenticated
};
export const handleGitHubUser = async (profile: any) => {
  const { id, username, displayName, emails } = profile;
  let user = await getUserByGitHubId(id);

  if (!user) {
    user = await createUser(
      id,
      username,
      emails?.[0]?.value || "",
      displayName || username,
    );
  }

  return user;
};
