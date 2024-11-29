import { Request, Response } from "express";
import * as photoService from "../services/photoService";

/**
 * Get photos by album ID
 */
export const getPhotosByAlbumId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { albumId } = req.params;
  try {
    const photos = await photoService.getPhotosByAlbumId(albumId);
    res.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Failed to fetch photos" });
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
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).json({ error: "Failed to fetch photo" });
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
  } catch (error) {
    console.error("Error updating photo title:", error);
    res.status(500).json({ error: "Failed to update photo title" });
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
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ error: "Failed to delete photo" });
  }
};
