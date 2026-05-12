require("dotenv").config();
const { connectToDatabase } = require("./config/db");
const BlogPost = require("./models/BlogPost");
const seedData = require("./seed/seedData");

async function migrateBlogs() {
  try {
    // Connect to Turso database using credentials from .env
    console.log("Connecting to the database...");
    await connectToDatabase();

    // 1. Remove all existing blogs from the database
    console.log("Removing all existing blogs...");
    await BlogPost.clear();
    console.log("Existing blogs removed.");

    // 2. Migrate again from the old website's data (seedData.js which comes from the old site)
    console.log(`Found ${seedData.blogs.length} blogs from the old website's data.`);
    console.log("Migrating blogs...");
    
    await BlogPost.bulkCreate(seedData.blogs);
    
    console.log("Blogs successfully migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateBlogs();
