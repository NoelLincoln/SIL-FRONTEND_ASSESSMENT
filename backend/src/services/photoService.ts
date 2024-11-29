import { PrismaClient, Photo } from "@prisma/client";
import cloudinary from "../config/cloudinaryConfig";

const prisma = new PrismaClient();

/**
 * Create a new photo in the database
 */
export const createPhoto = async (data: {
  albumId: string;
  title: string;
  imageUrl: string;
}): Promise<Photo> => {
  return prisma.photo.create({
    data: {
      albumId: data.albumId,
      title: data.title,
      imageUrl: data.imageUrl,
    },
  });
};

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
  const photoExists = await prisma.photo.findUnique({ where: { id } });
  if (!photoExists) {
    throw new Error("Photo not found");
  }

  return prisma.photo.update({
    where: { id },
    data: { title },
  });
};

/**
 * Delete a photo by ID
 */
export const deletePhoto = async (id: string): Promise<Photo | null> => {
  const photoExists = await prisma.photo.findUnique({ where: { id } });
  if (!photoExists) {
    throw new Error("Photo not found");
  }

  return prisma.photo.delete({
    where: { id },
  });
};
