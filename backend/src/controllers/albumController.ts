import { Request, Response } from "express";
import * as albumService from "../services/albumService";
import cloudinary from "../config/cloudinaryConfig";
import * as userService from "../services/userService"; // Importing userService

/**
 * Get all albums
 */
export const getAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const albums = await albumService.getAlbums();
    res.status(200).json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
};

/**
 * Get album by ID
 */
export const getAlbumById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const album = await albumService.getAlbumById(id);
    if (!album) {
      res.status(404).json({ error: "Album not found" });
      return;
    }
    res.status(200).json(album);
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).json({ error: "Failed to fetch album" });
  }
};

/**
 * Create a new album
 */
export const createAlbum = async (req: Request, res: Response): Promise<void> => {
  const { title, userId } = req.body;
  const files = req.files as Express.Multer.File[];

  console.log("Creating album with title:", title);
  console.log("User ID:", userId);
  console.log("Files received:", files);

  try {
    // Create the album and get the album data along with the username
    const newAlbum = await albumService.createAlbum({ title, userId });
    console.log("New album created:", newAlbum);

    // Upload photos to Cloudinary
    const photoUrls = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "albums",
        });
        console.log("Uploaded photo URL:", result.secure_url);
        return result.secure_url;
      })
    );

    // Associate photos with the album
    await albumService.addPhotosToAlbum(newAlbum.id, photoUrls);
    console.log("Photos added to album:", newAlbum.id);

    // Send the response with the album and username
    res.status(201).json(newAlbum);
  } catch (error) {
    console.error("Error creating album:", error);
    res.status(500).json({ error: "Failed to create album" });
  }
};
/**
 * Update album by ID
 */
export const updateAlbum = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedAlbum = await albumService.updateAlbum(id, { title });
    if (!updatedAlbum) {
      res.status(404).json({ error: "Album not found" });
      return;
    }
    res.status(200).json(updatedAlbum);
  } catch (error) {
    console.error("Error updating album:", error);
    res.status(500).json({ error: "Failed to update album" });
  }
};

/**
 * Delete album by ID
 */
export const deleteAlbum = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedAlbum = await albumService.deleteAlbum(id);
    if (!deletedAlbum) {
      res.status(404).json({ error: "Album not found" });
      return;
    }
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({ error: "Failed to delete album" });
  }
};
