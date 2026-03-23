const createSqliteModel = require("./createSqliteModel");
const { asString, asInteger, asDateString, pickEnum } = require("./shared");

module.exports = createSqliteModel({
  tableName: "client_reviews",
  columns: {
    clientId: "TEXT",
    reviewDate: "TEXT",
    overallHealth: "TEXT",
  },
  indexFields: ["clientId", "reviewDate"],
  defaultSort: { reviewDate: -1 },
  normalize(payload = {}) {
    return {
      clientId: asString(payload.clientId),
      reviewDate: asDateString(payload.reviewDate, new Date().toISOString()),
      seoScore: asInteger(payload.seoScore, 0),
      socialScore: asInteger(payload.socialScore, 0),
      websiteScore: asInteger(payload.websiteScore, 0),
      overallHealth: pickEnum(payload.overallHealth, ["green", "amber", "red"], "green"),
      notes: asString(payload.notes),
      reviewedBy: asString(payload.reviewedBy),
    };
  },
});
