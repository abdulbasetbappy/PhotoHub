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
      const folder = img.public_id.split('/')[0]; // Extract folder name
      const name = img.public_id.split('/').pop(); // Extract the image name
      const size = (img.bytes / (1024 * 1024)).toFixed(2); // Accurate MB size

      if (!acc[folder]) acc[folder] = [];

      // ✅ No limit per folder - Include all images
      acc[folder].push({
        id: img.public_id,
        url: img.secure_url,
        name: name.split('_').pop(), // Remove timestamp from name
        folder: folder,
        format: img.format,
        size:size, 
        width: img.width,
        height: img.height,
      });

      return acc;
    }, {});

    return groupedImages;
  } catch (error) {
    return { error: error.message };
  }
});
