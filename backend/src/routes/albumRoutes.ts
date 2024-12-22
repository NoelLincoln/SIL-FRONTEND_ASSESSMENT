import express from "express";
import multer from "multer";
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addPhotosToAlbum,
  getAlbumsByUserId,
} from "../controllers/albumController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

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
router.post("/", upload.array("photos", 3), createAlbum);

/**
 * Update album by ID
 */
router.patch("/:id", updateAlbum);


router.patch("/:id/photos", upload.array("photos", 3), addPhotosToAlbum);


// Get albums by userId
router.get("/users/:userId", getAlbumsByUserId)

/**
 * Delete an album by ID
 */
router.delete("/:id", deleteAlbum);

export default router;
