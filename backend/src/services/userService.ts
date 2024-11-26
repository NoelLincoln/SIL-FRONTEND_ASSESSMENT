// src/services/userService.ts
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get a user by their GitHub ID.
 */
export const getUserByGitHubId = async (
  githubId: string,
): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { githubId },
  });
};

/**
 * Create a new user from GitHub profile information.
 */
export const createUser = async (
  githubId: string,
  username: string,
  email: string,
  name: string,
): Promise<User> => {
  return await prisma.user.create({
    data: {
      githubId,
      username,
      email,
      name,
    },
  });
};
