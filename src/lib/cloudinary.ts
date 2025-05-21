
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads an image to Cloudinary and returns the URL
 * @param fileBuffer The buffer of the file to upload
 * @param filename The filename to use
 * @returns The URL of the uploaded image
 */
export async function uploadImage(fileBuffer: ArrayBuffer, filename: string): Promise<string> {
  try {
    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(fileBuffer);
    
    // Create a unique filename
    const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '_')}`;

    // Upload to Cloudinary using buffer upload
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image", filename_override: uniqueFilename }, 
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

export default cloudinary;
