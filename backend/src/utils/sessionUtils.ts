import express from "express";

// Function to check if the user session is active (using Passport's req.user)
export const checkSession = (req: express.Request): boolean => {
  return req.user ? true : false;
};

// Function to get the authenticated user's ID from the session (Passport will populate `req.user`)
export const getUserFromSession = (req: express.Request): string | null => {
  return req.user ? (req.user as string) : null;
};
