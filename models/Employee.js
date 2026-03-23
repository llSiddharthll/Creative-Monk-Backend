const createSqliteModel = require("./createSqliteModel");
const {
  asBoolean,
  asDateString,
  asInteger,
  asNumber,
  asString,
  asStringArray,
  pickEnum,
} = require("./shared");

module.exports = createSqliteModel({
  tableName: "employees",
  columns: {
    name: "TEXT",
    role: "TEXT",
    department: "TEXT",
    email: "TEXT",
    status: "TEXT",
    employmentType: "TEXT",
    monthlySalary: "REAL",
    utilizationPct: "INTEGER",
    ownerLevel: "TEXT",
    order: "INTEGER",
    isActive: "INTEGER",
  },
  indexFields: ["department", "status", "employmentType", "order", "isActive"],
  normalize(payload = {}) {
    return {
      name: asString(payload.name),
      role: asString(payload.role),
      department: asString(payload.department),
      email: asString(payload.email).toLowerCase(),
      phone: asString(payload.phone),
      avatar: asString(payload.avatar),
      status: pickEnum(
        payload.status,
        ["active", "on-leave", "probation", "freelance", "inactive"],
        "active",
      ),
      employmentType: pickEnum(
        payload.employmentType,
        ["full-time", "part-time", "contract", "intern"],
        "full-time",
      ),
      monthlySalary: asNumber(payload.monthlySalary, 0),
      utilizationPct: asInteger(payload.utilizationPct, 0),
      ownerLevel: pickEnum(payload.ownerLevel, ["lead", "member", "executive"], "member"),
      joinedAt: asDateString(payload.joinedAt, new Date().toISOString()),
      assignedClients: asStringArray(payload.assignedClients),
      primarySkills: asStringArray(payload.primarySkills),
      goals: asStringArray(payload.goals),
      notes: asString(payload.notes),
      order: asInteger(payload.order, 0),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
