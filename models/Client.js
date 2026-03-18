const createSqliteModel = require("./createSqliteModel");
const { asBoolean, asInteger, asString, pickEnum } = require("./shared");

module.exports = createSqliteModel({
  tableName: "clients",
  columns: {
    name: "TEXT",
    website: "TEXT",
    logo: "TEXT",
    status: "TEXT",
    order: "INTEGER",
    isFeatured: "INTEGER",
  },
  indexFields: ["status", "order", "isFeatured"],
  normalize(payload = {}) {
    return {
      name: asString(payload.name),
      website: asString(payload.website),
      logo: asString(payload.logo),
      status: pickEnum(payload.status, ["active", "inactive"], "active"),
      order: asInteger(payload.order, 0),
      isFeatured: asBoolean(payload.isFeatured, false),
    };
  },
});
