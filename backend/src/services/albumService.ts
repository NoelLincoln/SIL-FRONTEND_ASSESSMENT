import { PrismaClient, Album } from "@prisma/client";
import cloudinary from "../config/cloudinaryConfig";

const prisma = new PrismaClient();

/**
 * Get all albums with username
 */
export const getAlbums = async (): Promise<Album[]> => {
  return prisma.album.findMany({
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
};

/**
 * Get album by ID
 */
export const getAlbumById = async (id: string): Promise<Album | null> => {
  return prisma.album.findUnique({
    where: { id },
  });
};

/**
 * Create a new album
 */
export const createAlbum = async (data: {
  title: string;
  userId: string;
}): Promise<Album> => {
  return prisma.album.create({
    data,
  });
};

/**
 * Add photos to an album
 */
export const addPhotosToAlbum = async (
  albumId: string,
  photoUrls: string[],
): Promise<void> => {
  await Promise.all(
    photoUrls.map((url) =>
      prisma.photo.create({
        data: {
          title: "Photo",
          imageUrl: url,
          albumId,
        },
      }),
    ),
  );
};

/**
 * Update an album by ID
 */
export const updateAlbum = async (
  id: string,
  data: { title: string },
): Promise<Album | null> => {
  return prisma.album.update({
    where: { id },
    data,
  });
};

/**
 * Delete album by ID
 */
export const deleteAlbum = async (id: string): Promise<Album | null> => {
  return prisma.album.delete({
    where: { id },
  });
};
