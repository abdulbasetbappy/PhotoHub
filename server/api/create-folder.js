import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const folderName = body.folder?.trim();

  if (!folderName) {
    return { success: false, error: "Folder name is required!" };
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    // Check if the folder already exists
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderName,
      max_results: 1
    });

    if (resources.length > 0) {
      return { success: false, error: "Folder already exists!" };
    }

    // Upload a blank base64 image (1x1 pixel)
    await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/eoNzKkAAAAASUVORK5CYII=", {
      folder: folderName,
      public_id: "placeholder",
      overwrite: false
    });

    return { success: true, message: `Folder "${folderName}" created successfully!` };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
