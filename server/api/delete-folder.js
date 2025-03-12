import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const folder = body.folder;

  if (!folder) {
    return { success: false, error: "Folder name is required!" };
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    // List all images in the folder
    const { resources } = await cloudinary.api.resources({ type: 'upload', prefix: folder });

    // Delete each image inside the folder
    await Promise.all(resources.map(img => cloudinary.uploader.destroy(img.public_id)));

    // Delete the folder
    await cloudinary.api.delete_folder(folder);

    return { success: true, message: "Folder deleted successfully!" };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
