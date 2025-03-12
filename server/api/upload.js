import { v2 as cloudinary } from 'cloudinary';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export default defineEventHandler(async (event) => {
  try {
    console.log("🔹 Receiving file upload request...");

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Read multipart form data
    const formData = await readMultipartFormData(event);
    if (!formData) {
      console.error("❌ Failed to read file data");
      return { error: "Failed to read file data" };
    }

    console.log("✅ Form data received:", formData.map(f => f.name));

    // Extract required fields
    const file = formData.find((item) => item.name === 'file');
    const folder = formData.find((item) => item.name === 'folder')?.data.toString() || 'uploads';
    const originalName = formData.find((item) => item.name === 'name')?.data.toString() || file.filename;

    if (!file) {
      console.error("❌ Missing file in request");
      return { error: "Missing file" };
    }

    console.log("✅ File received:", file.filename);

    // Generate timestamped filename (YYYYMMDD_HHMMSS_originalName)
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const formattedName = `${timestamp}_${originalName}`;

    // Save file temporarily
    const tempFilePath = join(tmpdir(), file.filename);
    await writeFile(tempFilePath, file.data);
    console.log("✅ File saved temporarily:", tempFilePath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: folder,
      public_id: formattedName,
      resource_type: 'image',
    });

    console.log("✅ Cloudinary Upload Success:", result.secure_url);
    return { url: result.secure_url };
  } catch (error) {
    console.error("❌ Upload Error:", error);
    return { error: error.message };
  }
});
