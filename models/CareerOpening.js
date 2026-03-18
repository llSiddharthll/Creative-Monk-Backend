const createSqliteModel = require("./createSqliteModel");
const { asBoolean, asInteger, asString, asStringArray } = require("./shared");

module.exports = createSqliteModel({
  tableName: "career_openings",
  columns: {
    title: "TEXT",
    department: "TEXT",
    type: "TEXT",
    location: "TEXT",
    experience: "TEXT",
    description: "TEXT",
    applyEmail: "TEXT",
    isActive: "INTEGER",
    order: "INTEGER",
  },
  indexFields: ["department", "type", "location", "order", "isActive"],
  normalize(payload = {}) {
    return {
      title: asString(payload.title),
      department: asString(payload.department),
      type: asString(payload.type),
      location: asString(payload.location),
      experience: asString(payload.experience),
      description: asString(payload.description),
      skills: asStringArray(payload.skills),
      applyEmail: asString(payload.applyEmail),
      isActive: asBoolean(payload.isActive, true),
      order: asInteger(payload.order, 0),
    };
  },
});
