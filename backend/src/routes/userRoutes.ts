// src/routes/userRoutes.ts
import express from "express";
import { fetchCurrentUser } from "../controllers/userController";

const router = express.Router();

// GET /api/users/current - Fetch the currently logged-in user (from session)
router.get("/current", fetchCurrentUser);

export default router;
