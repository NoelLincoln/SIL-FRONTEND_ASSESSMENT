import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { Response, NextFunction } from "express";
import { MulterRequest } from "../types/express"; // Use the extended Request type
import upload from "../utils/multer";

const prisma = new PrismaClient();

// Middleware for handling file uploads (multer)
export const handleFileUpload = (
  req: MulterRequest,
  res: Response,
  next: NextFunction,
) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// Function to upload image to Cloudinary
export const uploadImageToCloudinary = async (
  imagePath: string,
): Promise<string> => {
  try {
    console.log("Uploading image to Cloudinary at path:", imagePath); // Log image path
    const result = await cloudinary.uploader.upload(imagePath); // Promisified upload
    if (result?.secure_url) {
      console.log("Cloudinary Upload Successful:", result.secure_url); // Log successful upload URL
      return result.secure_url; // Return the secure URL
    }
    throw new Error("Image upload failed: No secure URL returned.");
  } catch (error: unknown) {
    // Ensure error is typed as an instance of Error
    if (error instanceof Error) {
      console.error("Cloudinary upload error:", error.message); // Log upload error
      throw new Error(`Cloudinary upload error: ${error.message}`);
    } else {
      throw new Error("Cloudinary upload error: Unknown error occurred");
    }
  }
};

// Create a new photo
export const createPhoto = async (
  albumId: string,
  title: string,
  imagePath: string,
) => {
  try {
    console.log(
      "Creating photo with albumId:",
      albumId,
      "title:",
      title,
      "imagePath:",
      imagePath,
    );
    const imageUrl = await uploadImageToCloudinary(imagePath);
    console.log("Saving photo to database with URL:", imageUrl);

    const newPhoto = await prisma.photo.create({
      data: {
        title,
        imageUrl,
        albumId,
      },
    });

    console.log("Photo created successfully:", newPhoto);
    return newPhoto;
  } catch (error: unknown) {
    console.error(
      "Error creating photo:",
      error instanceof Error ? error.message : error,
    );
    throw new Error("Error creating photo");
  }
};

// Get all photos
export const getAllPhotos = async () => {
  return await prisma.photo.findMany();
};

// Get photos by album ID
export const getPhotosByAlbumId = async (albumId: string) => {
  return await prisma.photo.findMany({
    where: {
      albumId,
    },
  });
};

// Update photo details
export const updatePhoto = async (
  id: string,
  title: string,
  imageUrl: string,
) => {
  return await prisma.photo.update({
    where: { id },
    data: { title, imageUrl },
  });
};

// Delete a photo
export const deletePhoto = async (id: string) => {
  return await prisma.photo.delete({
    where: { id },
  });
};
