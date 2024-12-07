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
export const createAlbum = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { title, userId } = req.body;
  const files = req.files as Express.Multer.File[];

  try {
    // Create the album
    const newAlbum = await albumService.createAlbum({ title, userId });

    // Fetch the user's username
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Upload photos to Cloudinary
    const photoUrls = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "albums",
        });
        return result.secure_url;
      }),
    );

    // Associate photos with the album
    await albumService.addPhotosToAlbum(newAlbum.id, photoUrls);

    // Include username in the response
    const albumWithUser = {
      ...newAlbum,
      username: user.username,
    };

    res.status(201).json(albumWithUser);
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

/**
 * Add photos to album
 */
export const addPhotosToAlbum = async (req: Request, res: Response): Promise<void> => {
  const { id: albumId } = req.params;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    res.status(400).json({ error: "No files uploaded" });
    return;
  }

  try {
    const photoUrls = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "albums",
        });
        return result.secure_url;
      })
    );

    // Add photos to album in the database
    await albumService.addPhotosToAlbum(albumId, photoUrls);

    // Prepare response data
    const newPhotos = photoUrls.map((url) => ({
      title: "Photo",
      imageUrl: url,
    }));

    // Return the response with the uploaded photos
    res.status(201).json(newPhotos);
  } catch (error) {
    console.error("Error adding photos to album:", error);
    res.status(500).json({ error: "Failed to add photos to album" });
  }
};
