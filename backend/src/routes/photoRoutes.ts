import express from "express";
import * as photoController from "../controllers/photoController";

const router = express.Router();

// Get photos by album ID
router.get("/album/:albumId", photoController.getPhotosByAlbumId);

// Get a single photo by ID
router.get("/:id", photoController.getPhotoById);

// Update a photo title
router.put("/:id", photoController.updatePhotoTitle);

// Delete a photo
router.delete("/:id", photoController.deletePhoto);

export default router;
