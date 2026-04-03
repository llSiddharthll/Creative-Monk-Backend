const createSqliteModel = require("./createSqliteModel");
const {
  asBoolean,
  asInteger,
  asString,
  asStringArray,
  normalizeMetrics,
  normalizeSeo,
  normalizeTestimonialQuote,
} = require("./shared");

module.exports = createSqliteModel({
  tableName: "case_studies",
  columns: {
    id: "TEXT",
    title: "TEXT",
    client: "TEXT",
    category: "TEXT",
    description: "TEXT",
    content: "TEXT",
    link: "TEXT",
    duration: "TEXT",
    image: "TEXT",
    portfolioImage: "TEXT",
    order: "INTEGER",
    isFeatured: "INTEGER",
    isActive: "INTEGER",
  },
  uniqueFields: ["id"],
  indexFields: ["id", "category", "order", "isFeatured", "isActive"],
  normalize(payload = {}, { existing = null, changes = {} } = {}) {
    const nextPortfolioImage =
      changes.portfolioImage !== undefined
        ? asString(changes.portfolioImage)
        : asString(existing?.portfolioImage || existing?.image || payload.portfolioImage || payload.image);

    return {
      id: asString(payload.id),
      title: asString(payload.title),
      client: asString(payload.client),
      category: asString(payload.category),
      description: asString(payload.description),
      content: asString(payload.content),
      services: asStringArray(payload.services),
      challenges: asStringArray(payload.challenges),
      solutions: asStringArray(payload.solutions),
      results: asStringArray(payload.results),
      metrics: normalizeMetrics(payload.metrics),
      gallery: asStringArray(payload.gallery),
      testimonial: normalizeTestimonialQuote(payload.testimonial),
      link: asString(payload.link),
      duration: asString(payload.duration),
      image: asString(payload.image),
      portfolioImage: nextPortfolioImage,
      seo: normalizeSeo(payload.seo),
      order: asInteger(payload.order, 0),
      isFeatured: asBoolean(payload.isFeatured, false),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
