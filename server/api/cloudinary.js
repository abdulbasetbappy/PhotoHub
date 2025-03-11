import { v2 as cloudinary } from 'cloudinary';

export default defineEventHandler(async (event) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const query = getQuery(event);
  const folderPath = query.category ? query.category : '';

  try {
    const response = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath, // Fetch only from the specified folder
      max_results: 50
    });

    const groupedImages = response.resources.reduce((acc, img) => {
      // Extract folder name from `public_id`
      const pathParts = img.public_id.split('/');
      const folder = pathParts.length > 1 ? pathParts[0] : 'Uncategorized';

      if (!acc[folder]) acc[folder] = [];
      
      // Add image only if folder has less than 10 images
      if (acc[folder].length < 10) {
        acc[folder].push({
          url: img.secure_url,
          folder: folder
        });
      }

      return acc;
    }, {});

    return groupedImages;
  } catch (error) {
    return { error: error.message };
  }
});
