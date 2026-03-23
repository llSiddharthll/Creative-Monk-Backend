const createSqliteModel = require("./createSqliteModel");
const { asString, pickEnum } = require("./shared");

module.exports = createSqliteModel({
  tableName: "activities",
  columns: {
    leadId: "TEXT",
    clientId: "TEXT",
    type: "TEXT",
    content: "TEXT",
    createdBy: "TEXT",
  },
  indexFields: ["leadId", "clientId", "type", "createdAt"],
  defaultSort: { createdAt: -1 },
  normalize(payload = {}) {
    return {
      leadId: asString(payload.leadId),
      clientId: asString(payload.clientId),
      type: pickEnum(payload.type, ["note", "call", "email", "meeting", "stage_change", "system"], "note"),
      content: asString(payload.content),
      metadata: payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {},
      createdBy: asString(payload.createdBy),
    };
  },
});
