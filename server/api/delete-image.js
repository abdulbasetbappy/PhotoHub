import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const publicId = body.publicId;

  if (!publicId) {
    return { success: false, error: "Image ID is required!" };
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true, message: "Image deleted successfully!" };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
