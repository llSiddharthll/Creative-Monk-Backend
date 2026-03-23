const createSqliteModel = require("./createSqliteModel");
const { asString, asDateString, pickEnum } = require("./shared");

module.exports = createSqliteModel({
  tableName: "follow_ups",
  columns: {
    leadId: "TEXT",
    clientId: "TEXT",
    title: "TEXT",
    dueDate: "TEXT",
    status: "TEXT",
  },
  indexFields: ["leadId", "clientId", "status", "dueDate"],
  defaultSort: { dueDate: 1 },
  normalize(payload = {}) {
    return {
      leadId: asString(payload.leadId),
      clientId: asString(payload.clientId),
      title: asString(payload.title),
      notes: asString(payload.notes),
      dueDate: asDateString(payload.dueDate, new Date().toISOString()),
      status: pickEnum(payload.status, ["pending", "done"], "pending"),
      completedAt: asString(payload.completedAt),
      createdBy: asString(payload.createdBy),
    };
  },
});
