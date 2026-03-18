const createSqliteModel = require("./createSqliteModel");
const { asBoolean, asInteger, asString, normalizeSocial } = require("./shared");

module.exports = createSqliteModel({
  tableName: "team_members",
  columns: {
    name: "TEXT",
    role: "TEXT",
    bio: "TEXT",
    image: "TEXT",
    order: "INTEGER",
    isActive: "INTEGER",
  },
  indexFields: ["order", "isActive"],
  normalize(payload = {}) {
    return {
      name: asString(payload.name),
      role: asString(payload.role),
      bio: asString(payload.bio),
      image: asString(payload.image),
      social: normalizeSocial(payload.social),
      order: asInteger(payload.order, 0),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
