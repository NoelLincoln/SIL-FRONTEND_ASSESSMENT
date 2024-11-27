import { Request, Response } from "express";
import * as cloudinaryService from "../services/cloudinaryService";

// Upload a photo to Cloudinary and save the URL to the database
export const uploadPhoto = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { albumId, title, imagePath } = req.body; // Assume these are passed in the body

  if (!imagePath || !albumId || !title) {
    res
      .status(400)
      .json({ error: "Image path, album ID, and title are required" });
    return;
  }

  try {
    const publicId = await cloudinaryService.uploadImage(
      imagePath,
      albumId,
      title,
    );

    if (publicId) {
      res
        .status(200)
        .json({ message: "Photo uploaded and saved successfully", publicId });
    } else {
      res.status(500).json({ error: "Failed to upload and save photo" });
    }
  } catch (error) {
    console.error("Error uploading and saving photo:", error);
    res.status(500).json({ error: "Failed to upload and save photo" });
  }
};

// Get colors from an uploaded image
export const getImageColors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { publicId } = req.params;

  if (!publicId) {
    res.status(400).json({ error: "Public ID is required" });
    return;
  }

  try {
    const colors = await cloudinaryService.getAssetInfo(publicId);
    res.status(200).json({ colors });
  } catch (error) {
    console.error("Error getting image colors:", error);
    res.status(500).json({ error: "Failed to get image colors" });
  }
};

// Create an image tag with transformations
export const createImageTag = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { publicId, effectColor, backgroundColor } = req.body;

  if (!publicId || !effectColor || !backgroundColor) {
    res
      .status(400)
      .json({
        error: "Public ID, effect color, and background color are required",
      });
    return;
  }

  try {
    const imageTag = cloudinaryService.createImageTag(
      publicId,
      effectColor,
      backgroundColor,
    );
    res.status(200).json({ imageTag });
  } catch (error) {
    console.error("Error creating image tag:", error);
    res.status(500).json({ error: "Failed to create image tag" });
  }
};
