const createSqliteModel = require("./createSqliteModel");
const { asBoolean, asInteger, asString, pickEnum } = require("./shared");

module.exports = createSqliteModel({
  tableName: "faqs",
  columns: {
    question: "TEXT",
    answer: "TEXT",
    page: "TEXT",
    order: "INTEGER",
    isActive: "INTEGER",
  },
  indexFields: ["page", "order", "isActive"],
  defaultSort: {
    page: 1,
    order: 1,
    createdAt: -1,
  },
  normalize(payload = {}) {
    return {
      question: asString(payload.question),
      answer: asString(payload.answer),
      page: pickEnum(payload.page, ["home", "services", "contact", "about", "general"], "general"),
      order: asInteger(payload.order, 0),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
