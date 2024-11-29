import { Request, Response } from "express";
import * as photoService from "../services/photoService";
import cloudinary from "../config/cloudinaryConfig";

/**
 * Create a new photo (uploads to Cloudinary)
 */
export const createPhoto = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { albumId, title } = req.body;
  const file = req.file as Express.Multer.File;

  if (!file) {
    res.status(400).json({ error: "No photo file provided" });
    return;
  }

  try {
    // Upload photo to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "photos",
    });

    // Save photo data to the database
    const newPhoto = await photoService.createPhoto({
      albumId,
      title,
      imageUrl: result.secure_url,
    });

    res.status(201).json(newPhoto);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating photo:", error.message);
      res.status(500).json({ error: "Failed to create photo" });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

/**
 * Get all photos by album ID
 */
export const getPhotosByAlbumId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { albumId } = req.params;
  try {
    const photos = await photoService.getPhotosByAlbumId(albumId);
    res.status(200).json(photos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching photos:", error.message);
      res.status(500).json({ error: "Failed to fetch photos" });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

/**
 * Get a photo by ID
 */
export const getPhotoById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const photo = await photoService.getPhotoById(id);
    if (!photo) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }
    res.status(200).json(photo);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching photo:", error.message);
      res.status(500).json({ error: "Failed to fetch photo" });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

/**
 * Update photo title
 */
export const updatePhotoTitle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedPhoto = await photoService.updatePhotoTitle(id, title);
    if (!updatedPhoto) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }
    res.status(200).json(updatedPhoto);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating photo title:", error.message);
      res.status(500).json({ error: "Failed to update photo title" });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

/**
 * Delete a photo by ID
 */
export const deletePhoto = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedPhoto = await photoService.deletePhoto(id);
    if (!deletedPhoto) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }
    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting photo:", error.message);
      res.status(500).json({ error: "Failed to delete photo" });
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};
