require("dotenv").config();
const fs = require("fs");
const { connectToDatabase } = require("./config/db");
const BlogPost = require("./models/BlogPost");

function stripHtmlAndWpTags(html) {
  if (!html) return "";
  // Remove WordPress block comments
  let text = html.replace(/<!--[\s\S]*?-->/g, "");
  // Remove HTML tags
  text = text.replace(/<\/?[^>]+(>|$)/g, " ");
  // Remove multiple spaces
  text = text.replace(/\s+/g, " ").trim();
  // Unescape common entities
  text = text.replace(/&nbsp;/g, " ")
             .replace(/&amp;/g, "&")
             .replace(/&lt;/g, "<")
             .replace(/&gt;/g, ">")
             .replace(/&quot;/g, '"')
             .replace(/&#8217;/g, "'")
             .replace(/&#8220;/g, '"')
             .replace(/&#8221;/g, '"');
  return text;
}

function extractFirstImage(content) {
  if (!content) return "";
  const match = content.match(/<img[^>]+src="([^">]+)"/i);
  // Also look for single quotes
  const match2 = content.match(/<img[^>]+src='([^'>]+)'/i);
  return match ? match[1] : (match2 ? match2[1] : "");
}

async function migrateBlogs() {
  try {
    const filePath = "/home/siddharth/Downloads/wp_posts.sql";
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log(`Reading SQL file: ${filePath}...`);
    const data = fs.readFileSync(filePath, "utf8");

    console.log("Parsing SQL to extract posts and attachments...");
    const inserts = data.split("INSERT INTO");
    
    const postsMap = new Map();
    const attachmentsMap = new Map(); // post_parent -> guid (image url)

    for (const insert of inserts) {
      if (
        !insert.trim().startsWith("`wp_posts`") &&
        !insert.trim().startsWith("wp_posts") &&
        !insert.trim().startsWith("`nqz_posts`") &&
        !insert.trim().startsWith("nqz_posts")
      ) {
        continue;
      }

      const valuesIndex = insert.indexOf("VALUES");
      if (valuesIndex === -1) continue;

      const valuesPart = insert.substring(valuesIndex + 6);

      let i = 0;
      while (i < valuesPart.length) {
        if (valuesPart[i] === "(") {
          let inString = false;
          let escape = false;
          let j = i + 1;
          let items = [];
          let currentItemStart = j;

          while (j < valuesPart.length) {
            let c = valuesPart[j];
            if (escape) {
              escape = false;
            } else if (c === "\\") {
              escape = true;
            } else if (c === "'") {
              inString = !inString;
            } else if (c === "," && !inString) {
              items.push(valuesPart.substring(currentItemStart, j));
              currentItemStart = j + 1;
            } else if (c === ")" && !inString) {
              items.push(valuesPart.substring(currentItemStart, j));

              if (items.length >= 21) {
                const id = items[0].trim().replace(/^'|'$/g, "");
                const contentRaw = items[4].trim().replace(/^'|'$/g, "").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
                const title = items[5].trim().replace(/^'|'$/g, "").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
                const excerptRaw = items[6].trim().replace(/^'|'$/g, "").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
                const status = items[7].trim().replace(/^'|'$/g, "");
                const slug = items[11].trim().replace(/^'|'$/g, "");
                const date = items[2].trim().replace(/^'|'$/g, "");
                const parent = items[17].trim().replace(/^'|'$/g, "");
                const guid = items[18].trim().replace(/^'|'$/g, "").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
                const type = items[20].trim().replace(/^'|'$/g, "");

                if (status === "publish" && type === "post") {
                  postsMap.set(id, {
                    id, title, slug, content: contentRaw, excerptRaw, date
                  });
                } else if (type === "attachment" && parent !== "0") {
                  // Keep the first attachment for a given post as the cover image
                  if (!attachmentsMap.has(parent)) {
                    attachmentsMap.set(parent, guid);
                  }
                }
              }
              i = j;
              break;
            }
            j++;
          }
        }
        i++;
      }
    }

    const blogs = Array.from(postsMap.values());
    console.log(`Found ${blogs.length} published blog posts.`);
    console.log(`Found ${attachmentsMap.size} attachments linked to posts.`);

    if (blogs.length === 0) {
      console.log("No blogs found. Exiting...");
      process.exit(0);
    }

    console.log("Connecting to the Turso database...");
    await connectToDatabase();

    console.log("Removing all existing blogs...");
    await BlogPost.clear();
    console.log("Existing blogs removed.");

    console.log("Migrating new blogs with cleaned excerpts and cover images...");
    const blogsToInsert = blogs.map((blog) => {
      // Clean excerpt
      let cleanedExcerpt = stripHtmlAndWpTags(blog.excerptRaw);
      if (!cleanedExcerpt) {
        // Fallback to content
        cleanedExcerpt = stripHtmlAndWpTags(blog.content).substring(0, 150) + "...";
      } else {
        cleanedExcerpt = cleanedExcerpt.substring(0, 150) + "...";
      }

      // Determine cover image
      // 1. Try attachment from post_parent
      // 2. Try first image in content
      // 3. Fallback to empty
      let coverImage = attachmentsMap.get(blog.id) || extractFirstImage(blog.content) || "";

      return {
        slug: blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: blog.title,
        excerpt: cleanedExcerpt,
        content: blog.content,
        coverImage: coverImage, 
        category: "Uncategorized", 
        author: "Creative Monk",
        publishedAt: new Date(blog.date).toISOString(),
        readTime: "5 min read",
        featured: false,
        isPublished: true,
      };
    });

    await BlogPost.bulkCreate(blogsToInsert);

    console.log("Blogs successfully migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateBlogs();
