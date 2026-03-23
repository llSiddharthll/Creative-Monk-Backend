const createSqliteModel = require("./createSqliteModel");
const { asString, asNumber, pickEnum } = require("./shared");

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
    stage: "TEXT",
    assignedTo: "TEXT",
    priority: "TEXT",
    estimatedValue: "REAL",
    convertedClientId: "TEXT",
  },
  indexFields: ["email", "service", "sourcePage", "status", "stage", "assignedTo", "createdAt"],
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
      stage: pickEnum(payload.stage, ["new", "qualified", "proposal_sent", "negotiation", "won", "lost"], "new"),
      assignedTo: asString(payload.assignedTo),
      priority: pickEnum(payload.priority, ["hot", "warm", "cold"], "cold"),
      estimatedValue: asNumber(payload.estimatedValue, 0),
      convertedClientId: asString(payload.convertedClientId),
    };
  },
});
