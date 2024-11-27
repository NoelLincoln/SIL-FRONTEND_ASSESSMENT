import { PrismaClient, Album } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all albums
 */
export const getAlbums = async (): Promise<Album[]> => {
  return prisma.album.findMany();
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
