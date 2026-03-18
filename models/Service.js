const createSqliteModel = require("./createSqliteModel");
const {
  asBoolean,
  asInteger,
  asString,
  asStringArray,
  normalizeFaqItems,
  normalizeProcessSteps,
  normalizeSeo,
} = require("./shared");

module.exports = createSqliteModel({
  tableName: "services",
  columns: {
    slug: "TEXT",
    title: "TEXT",
    shortTitle: "TEXT",
    tagline: "TEXT",
    shortDescription: "TEXT",
    longDescription: "TEXT",
    category: "TEXT",
    icon: "TEXT",
    image: "TEXT",
    order: "INTEGER",
    isFeatured: "INTEGER",
    isActive: "INTEGER",
  },
  uniqueFields: ["slug"],
  indexFields: ["slug", "category", "order", "isFeatured", "isActive"],
  normalize(payload = {}) {
    const title = asString(payload.title);

    return {
      slug: asString(payload.slug),
      title,
      shortTitle: asString(payload.shortTitle, title),
      tagline: asString(payload.tagline),
      shortDescription: asString(payload.shortDescription),
      longDescription: asString(payload.longDescription),
      category: asString(payload.category),
      icon: asString(payload.icon, "Code"),
      image: asString(payload.image),
      features: asStringArray(payload.features),
      process: normalizeProcessSteps(payload.process),
      outcomes: asStringArray(payload.outcomes),
      faqs: normalizeFaqItems(payload.faqs),
      seo: normalizeSeo(payload.seo),
      order: asInteger(payload.order, 0),
      isFeatured: asBoolean(payload.isFeatured, false),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
