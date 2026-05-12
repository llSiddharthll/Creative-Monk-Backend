require("dotenv").config();
const { connectToDatabase } = require("./config/db");
const BlogPost = require("./models/BlogPost");
const cloudinary = require("cloudinary").v2;
const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrateImagesViaFTP() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log("Connecting to the database...");
    await connectToDatabase();
    const blogs = await BlogPost.findAll();
    console.log(`Found ${blogs.length} blogs in the database.`);

    console.log("Connecting to FTP...");
    await client.access({
      host: "157.173.216.112",
      user: "u777841430.thecreativemonk.in",
      password: "CreativeMonk@1234",
      secure: false
    });
    console.log("Connected to FTP!");

    // Create a local temp directory
    const tempDir = path.join(__dirname, "temp_images");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    let updatedCount = 0;

    for (let blog of blogs) {
      if (blog.coverImage && blog.coverImage.includes("wp-content/uploads/")) {
        console.log(`\nProcessing image for blog: ${blog.title}`);
        
        // Extract the path after /wp-content/uploads/
        const match = blog.coverImage.match(/wp-content\/uploads\/(.+)$/);
        if (!match) {
          console.log(`Could not parse relative path from URL: ${blog.coverImage}`);
          continue;
        }

        const relativePath = match[1];
        // Clean URL params like ?w=1024 or ?resize=...
        const cleanRelativePath = relativePath.split('?')[0];
        
        // Sometimes WP dumps append dimensions like -1024x804 to the image, which might not be the original.
        // It's safer to try to download the clean path, but let's just download exactly what's there (without query strings).
        const ftpPath = `/public_html/wp-content/uploads/${cleanRelativePath}`;
        const fileName = path.basename(cleanRelativePath);
        const localPath = path.join(tempDir, fileName);

        console.log(`Downloading from FTP: ${ftpPath}`);
        try {
          await client.downloadTo(localPath, ftpPath);
          console.log(`Downloaded to local path: ${localPath}`);

          // Upload to Cloudinary
          console.log(`Uploading to Cloudinary...`);
          const result = await cloudinary.uploader.upload(localPath, {
            folder: "creative_monk_blogs",
            resource_type: "auto"
          });

          // Update the database
          await BlogPost.updateById(blog._id, { coverImage: result.secure_url });
          updatedCount++;
          console.log(`✅ Successfully uploaded and updated: ${result.secure_url}`);

          // Clean up local file
          fs.unlinkSync(localPath);
        } catch (err) {
          console.error(`❌ Failed to process image for ${blog.title}:`, err.message);
          if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath); // Clean up in case of partial download
          }
        }
      }
    }
    
    console.log(`\n🎉 Finished! Successfully downloaded, uploaded, and migrated ${updatedCount} images.`);
    client.close();
    process.exit(0);
  } catch (err) {
    console.error("Script failed:", err);
    client.close();
    process.exit(1);
  }
}

migrateImagesViaFTP();
