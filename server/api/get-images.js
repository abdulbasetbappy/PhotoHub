import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const folder = query.folder;

  if (!folder) {
    return { images: [] };
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    const response = await cloudinary.search
      .expression(`folder:${folder}`)
      .execute();

    return { images: response.resources.map(img => ({ public_id: img.public_id, url: img.secure_url })) };
  } catch (error) {
    return { error: error.message };
  }
});
