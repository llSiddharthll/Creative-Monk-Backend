const createSqliteModel = require("./createSqliteModel");
const {
  asBoolean,
  asDateString,
  asString,
  asStringArray,
  normalizeSeo,
} = require("./shared");

module.exports = createSqliteModel({
  tableName: "blog_posts",
  columns: {
    slug: "TEXT",
    title: "TEXT",
    excerpt: "TEXT",
    content: "TEXT",
    coverImage: "TEXT",
    category: "TEXT",
    author: "TEXT",
    publishedAt: "TEXT",
    readTime: "TEXT",
    featured: "INTEGER",
    isPublished: "INTEGER",
  },
  uniqueFields: ["slug"],
  indexFields: ["slug", "category", "publishedAt", "featured", "isPublished"],
  defaultSort: {
    featured: -1,
    publishedAt: -1,
  },
  normalize(payload = {}) {
    return {
      slug: asString(payload.slug),
      title: asString(payload.title),
      excerpt: asString(payload.excerpt),
      content: asString(payload.content),
      coverImage: asString(payload.coverImage),
      category: asString(payload.category),
      tags: asStringArray(payload.tags),
      author: asString(payload.author, "Creative Monk"),
      publishedAt: asDateString(payload.publishedAt),
      readTime: asString(payload.readTime, "5 min read"),
      featured: asBoolean(payload.featured, false),
      isPublished: asBoolean(payload.isPublished, true),
      seo: normalizeSeo(payload.seo),
    };
  },
});
