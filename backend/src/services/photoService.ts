import { PrismaClient, Photo } from "@prisma/client";
import cloudinary from "../config/cloudinaryConfig";

const prisma = new PrismaClient();

/**
 * Get photos by album ID
 */
export const getPhotosByAlbumId = async (albumId: string): Promise<Photo[]> => {
  return prisma.photo.findMany({
    where: { albumId },
  });
};

/**
 * Get a photo by ID
 */
export const getPhotoById = async (id: string): Promise<Photo | null> => {
  return prisma.photo.findUnique({
    where: { id },
  });
};

/**
 * Update photo title
 */
export const updatePhotoTitle = async (
  id: string,
  title: string,
): Promise<Photo | null> => {
  return prisma.photo.update({
    where: { id },
    data: { title },
  });
};

/**
 * Delete a photo by ID
 */
export const deletePhoto = async (id: string): Promise<Photo | null> => {
  return prisma.photo.delete({
    where: { id },
  });
};
