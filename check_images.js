require("dotenv").config();
const { connectToDatabase } = require("./config/db");
const BlogPost = require("./models/BlogPost");

async function checkImages() {
  await connectToDatabase();
  const blogs = await BlogPost.findAll();
  console.log("Total blogs:", blogs.length);
  const sampleImages = blogs.filter(b => b.coverImage).slice(0, 5).map(b => b.coverImage);
  console.log("Sample image URLs:", sampleImages);
  process.exit(0);
}

checkImages();
