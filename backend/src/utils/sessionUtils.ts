import { Request } from "express";

// Function to check if the user session is active
export const checkSession = (req: Request): boolean => {
  // Check if the session contains a user ID or any other identifying information
  return req.session?.passport?.user ? true : false;
};

// Function to get the authenticated user's ID from the session
export const getUserFromSession = (req: Request): string | null => {
  return req.session?.passport?.user || null;
};
