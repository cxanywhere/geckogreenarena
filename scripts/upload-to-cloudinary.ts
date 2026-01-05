import { v2 as cloudinary } from "cloudinary";
import path from "node:path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imagePath = path.join(process.cwd(), "attached_assets", "generated_images", "arena_login_background.png");

async function uploadToCloudinary() {
  console.log("Uploading arena image to Cloudinary...");
  console.log("Image path:", imagePath);
  
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "arena-ai",
      public_id: "arena_login_background",
      overwrite: true,
      resource_type: "image",
    });

    console.log("Upload successful!");
    console.log("Cloudinary URL:", result.secure_url);
    console.log("Public ID:", result.public_id);
    
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

uploadToCloudinary()
  .then((url) => {
    console.log("\n=== USE THIS URL IN LOGIN PAGE ===");
    console.log(url);
    console.log("===================================");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Upload failed:", error);
    process.exit(1);
  });
