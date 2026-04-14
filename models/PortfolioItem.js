const createSqliteModel = require("./createSqliteModel");
const { asBoolean, asInteger, asString, asStringArray } = require("./shared");
const crypto = require("crypto");

module.exports = createSqliteModel({
  tableName: "portfolio_items",
  columns: {
    id: "TEXT",
    title: "TEXT",
    description: "TEXT",
    category: "TEXT",
    client: "TEXT",
    duration: "TEXT",
    link: "TEXT",
    points: "TEXT",
    image: "TEXT",
    gallery: "TEXT",
    order: "INTEGER",
    isActive: "INTEGER",
  },
  uniqueFields: ["id"],
  indexFields: ["id", "category", "order", "isActive"],
  normalize(payload = {}, { existing = null } = {}) {
    return {
      id: asString(payload.id) || asString(existing?.id) || crypto.randomUUID(),
      title: asString(payload.title),
      description: asString(payload.description),
      category: asString(payload.category),
      client: asString(payload.client),
      duration: asString(payload.duration),
      link: asString(payload.link),
      points: asStringArray(payload.points),
      image: asString(payload.image),
      gallery: asStringArray(payload.gallery),
      order: asInteger(payload.order, 0),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
