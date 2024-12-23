// src/services/userService.ts
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Handle GitHub user creation if they don't exist in the database
 */
export const handleGitHubUser = async (profile: any): Promise<User> => {
  const { id, username, displayName, emails } = profile;

  // Extract the first email from GitHub
  const email = emails?.[0]?.value;

  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { githubId: id }, // Check if the user already exists by GitHub ID
        { email },        // Check if the user exists by email
      ],
    },
  });

  if (user) {
    console.log("User found:", user.username);
    return user; // Return the existing user
  }

  // If no existing user, create a new one
  user = await prisma.user.create({
    data: {
      githubId: id,
      username: username || "Unknown",
      email: email || `user-${id}@github.com`, // Fallback email if none provided
      name: displayName || username || "Unknown User",
    },
  });

  console.log("New user created:", user.username);
  return user;
};


/**
 * Get all users
 */
export const getUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany(); // Fetch all users
};

/**
 * Get a user by their ID
 */
export const getUserById = async (
  id: string,
): Promise<{ username: string } | null> => {
  return await prisma.user.findUnique({
    where: { id },
    select: { username: true },
  });
};

/**
 * Create a new user
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

/**
 * Update an existing user by ID
 */
export const updateUser = async (
  id: string,
  username: string,
  email: string,
  name: string,
): Promise<User | null> => {
  return await prisma.user.update({
    where: { id },
    data: {
      username,
      email,
      name,
    },
  });
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (id: string): Promise<User | null> => {
  return await prisma.user.delete({
    where: { id },
  });
};

/**
 * Get user by GitHub ID
 */
export const getUserByGitHubId = async (
  githubId: string,
): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { githubId },
  });
};
