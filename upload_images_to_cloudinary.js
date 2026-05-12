require("dotenv").config();
const { connectToDatabase } = require("./config/db");
const BlogPost = require("./models/BlogPost");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateImages() {
  try {
    await connectToDatabase();
    const blogs = await BlogPost.findAll();
    console.log(`Found ${blogs.length} blogs in the database.`);

    let updatedCount = 0;
    for (let blog of blogs) {
      if (blog.coverImage && (blog.coverImage.includes("thecreativemonk.in/wp-content") || blog.coverImage.includes("i0.wp.com"))) {
        console.log(`\nUploading image for blog: ${blog.title}`);
        console.log(`Original URL: ${blog.coverImage}`);
        
        try {
          const result = await cloudinary.uploader.upload(blog.coverImage, {
            folder: "creative_monk_blogs",
            resource_type: "auto"
          });
          
          await BlogPost.update(blog.id, { coverImage: result.secure_url });
          updatedCount++;
          console.log(`✅ Successfully uploaded to Cloudinary: ${result.secure_url}`);
        } catch (err) {
          console.error(`❌ Failed to upload image for ${blog.title}:`, err.message);
        }
      }
    }
    
    console.log(`\n🎉 Finished! Migrated ${updatedCount} images to Cloudinary and updated the database.`);
    process.exit(0);
  } catch (err) {
    console.error("Script failed:", err);
    process.exit(1);
  }
}

migrateImages();
