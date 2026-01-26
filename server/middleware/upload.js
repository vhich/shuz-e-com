import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config();

// 1. Multer Memory Storage (No local files created)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// 2. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Custom function to process image with Sharp and stream to Cloudinary
 */
export const processAndUpload = async (fileBuffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Enhanced Sharp processing
      const processedBuffer = await sharp(fileBuffer)
        .resize(1200, 1200, {
          // Increased resolution slightly for better 4K display
          fit: "inside",
          withoutEnlargement: true,
        })
        .sharpen({
          // Adds subtle crispness to edges (textures/stitching on shoes)
          sigma: 1,
          m1: 2,
          m2: 20,
        })
        .webp({
          quality: 100, // Max quality for WebP
          lossless: false, // Keep false but use 100 quality for best balance
          smartSubsample: true, // High-quality color reproduction
          effort: 6, // Spend more CPU time to make the file look better
        })
        .toBuffer();

      // 2. Cloudinary upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "shuz_products",
          resource_type: "image",
          // ADDED: ensure Cloudinary doesn't compress it again on their end
          transformation: [{ quality: "auto:best", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );

      uploadStream.end(processedBuffer);
    } catch (err) {
      reject(err);
    }
  });
};
