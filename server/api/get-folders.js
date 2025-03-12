import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    const response = await cloudinary.api.root_folders();
    return response.folders; // Returns list of folders
  } catch (error) {
    return { error: error.message };
  }
});
