import express from "express";
import * as photoController from "../controllers/photoController";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // configure multer for file uploads

// Create a photo
router.post("/", upload.single("photo"), photoController.createPhoto);

// Get all photos in an album
router.get("/albums/:albumId/photos", photoController.getPhotosByAlbumId);

// Get a photo by ID
router.get("/:id", photoController.getPhotoById);

// Update photo title
router.patch("/:id", photoController.updatePhotoTitle);

// Delete a photo by ID
router.delete("/:id", photoController.deletePhoto);

export default router;
