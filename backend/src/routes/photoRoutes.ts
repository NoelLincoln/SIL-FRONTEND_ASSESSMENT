import { Router } from "express";
import * as photoController from "../controllers/photoController";

const router = Router();

// Route to upload an image
router.post("/upload", photoController.uploadPhoto);

// Route to get image colors by public ID
router.get("/colors/:publicId", photoController.getImageColors);

// Route to create an image tag with transformations
router.post("/create-tag", photoController.createImageTag);

export default router;
