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
  tableName: "agency_clients",
  columns: {
    name: "TEXT",
    website: "TEXT",
    status: "TEXT",
    owner: "TEXT",
    monthlyRetainer: "REAL",
    projectHealth: "TEXT",
    seoScore: "INTEGER",
    socialScore: "INTEGER",
    websiteScore: "INTEGER",
    nextReviewDate: "TEXT",
    order: "INTEGER",
    isActive: "INTEGER",
  },
  indexFields: ["status", "owner", "projectHealth", "nextReviewDate", "order", "isActive"],
  normalize(payload = {}) {
    return {
      name: asString(payload.name),
      website: asString(payload.website),
      primaryContact: asString(payload.primaryContact),
      contactEmail: asString(payload.contactEmail).toLowerCase(),
      contactPhone: asString(payload.contactPhone),
      owner: asString(payload.owner),
      status: pickEnum(
        payload.status,
        ["onboarding", "active", "retainer", "paused", "offboarded"],
        "active",
      ),
      monthlyRetainer: asNumber(payload.monthlyRetainer, 0),
      projectHealth: pickEnum(payload.projectHealth, ["green", "amber", "red"], "green"),
      seoScore: asInteger(payload.seoScore, 0),
      socialScore: asInteger(payload.socialScore, 0),
      websiteScore: asInteger(payload.websiteScore, 0),
      nextReviewDate: asDateString(payload.nextReviewDate, new Date().toISOString()),
      services: asStringArray(payload.services),
      websitesManaged: asStringArray(payload.websitesManaged),
      priorityGoals: asStringArray(payload.priorityGoals),
      notes: asString(payload.notes),
      hasCmsAccess: asBoolean(payload.hasCmsAccess, false),
      order: asInteger(payload.order, 0),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
