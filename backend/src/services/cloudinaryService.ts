import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// Configure Cloudinary to use "https" URLs
cloudinary.config({
  secure: true,
});

// Uploads an image to Cloudinary and saves the URL to the database
export const uploadImage = async (
  imagePath: string,
  albumId: string,
  title: string,
): Promise<string | undefined> => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, options);

    if (result?.secure_url) {
      // Save the image URL to the database
      const newPhoto = await prisma.photo.create({
        data: {
          title,
          imageUrl: result.secure_url,
          albumId,
        },
      });
      return result.public_id;
    }

    throw new Error("Image upload failed: No secure URL returned.");
  } catch (error) {
    return undefined;
  }
};

// Get details of an uploaded image
export const getAssetInfo = async (publicId: string) => {
  const options = {
    colors: true,
  };

  try {
    const result = await cloudinary.api.resource(publicId, options);
    return result.colors;
  } catch (error) {
    return [];
  }
};

// Creates an HTML image tag with transformations applied
export const createImageTag = (
  publicId: string,
  effectColor: string,
  backgroundColor: string,
) => {
  // Generate an image tag with transformations
  const imageTag = cloudinary.image(publicId, {
    transformation: [
      { width: 250, height: 250, gravity: "faces", crop: "thumb" },
      { radius: "max" },
      { effect: "outline:10", color: effectColor },
      { background: backgroundColor },
    ],
  });

  return imageTag;
};
