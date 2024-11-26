import express from "express";
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from "../controllers/albumController";

const router = express.Router();

/**
 * Get all albums
 */
router.get("/", getAlbums);

/**
 * Get album by ID
 */
router.get("/:id", getAlbumById);

/**
 * Create a new album
 */
router.post("/", createAlbum);

/**
 * Update album by ID
 */
router.patch("/:id", updateAlbum);

/**
 * Delete an album by ID
 */
router.delete("/:id", deleteAlbum);

export default router;
