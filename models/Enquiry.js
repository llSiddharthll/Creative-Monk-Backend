const createSqliteModel = require("./createSqliteModel");
const { asString, pickEnum } = require("./shared");

module.exports = createSqliteModel({
  tableName: "enquiries",
  columns: {
    name: "TEXT",
    email: "TEXT",
    phone: "TEXT",
    service: "TEXT",
    message: "TEXT",
    sourcePage: "TEXT",
    status: "TEXT",
    notes: "TEXT",
  },
  indexFields: ["email", "service", "sourcePage", "status", "createdAt"],
  defaultSort: {
    createdAt: -1,
  },
  normalize(payload = {}) {
    return {
      name: asString(payload.name),
      email: asString(payload.email).toLowerCase(),
      phone: asString(payload.phone),
      service: asString(payload.service),
      message: asString(payload.message),
      sourcePage: asString(payload.sourcePage, "contact"),
      status: pickEnum(payload.status, ["new", "in-progress", "responded", "archived"], "new"),
      notes: asString(payload.notes),
    };
  },
});
