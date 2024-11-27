import { Request, Response } from "express";
import * as albumService from "../services/albumService";

/**
 * Get all albums
 */
export const getAlbums = async (req: Request, res: Response): Promise<void> => {
  try {
    const albums = await albumService.getAlbums();
    res.status(200).json(albums);
  } catch (error) {
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
  try {
    const newAlbum = await albumService.createAlbum({ title, userId });
    res.status(201).json(newAlbum);
  } catch (error) {
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
    res.status(500).json({ error: "Failed to delete album" });
  }
};
