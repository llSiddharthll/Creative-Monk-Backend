const createSqliteModel = require("./createSqliteModel");
const { asBoolean, asInteger, asString } = require("./shared");

module.exports = createSqliteModel({
  tableName: "testimonials",
  columns: {
    name: "TEXT",
    role: "TEXT",
    company: "TEXT",
    text: "TEXT",
    rating: "INTEGER",
    avatar: "TEXT",
    order: "INTEGER",
    isFeatured: "INTEGER",
    isActive: "INTEGER",
  },
  indexFields: ["order", "isFeatured", "isActive"],
  normalize(payload = {}) {
    const rating = Math.min(Math.max(asInteger(payload.rating, 5), 1), 5);

    return {
      name: asString(payload.name),
      role: asString(payload.role),
      company: asString(payload.company),
      text: asString(payload.text),
      rating,
      avatar: asString(payload.avatar),
      order: asInteger(payload.order, 0),
      isFeatured: asBoolean(payload.isFeatured, false),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
