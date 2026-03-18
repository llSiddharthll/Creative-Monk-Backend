const createSqliteModel = require("./createSqliteModel");
const { asBoolean, asInteger, asString } = require("./shared");

module.exports = createSqliteModel({
  tableName: "service_categories",
  columns: {
    title: "TEXT",
    slug: "TEXT",
    description: "TEXT",
    icon: "TEXT",
    order: "INTEGER",
    isActive: "INTEGER",
  },
  uniqueFields: ["slug"],
  indexFields: ["slug", "order", "isActive"],
  normalize(payload = {}) {
    return {
      title: asString(payload.title),
      slug: asString(payload.slug),
      description: asString(payload.description),
      icon: asString(payload.icon, "Sparkles"),
      order: asInteger(payload.order, 0),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
