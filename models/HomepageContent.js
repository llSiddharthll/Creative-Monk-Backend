const createSqliteModel = require("./createSqliteModel");
const { asString } = require("./shared");

const ALLOWED_SECTIONS = new Set([
  "hero",
  "client_marquee",
  "services_deck",
  "process",
  "testimonials",
  "faq",
  "cta",
  "about",
]);

function asPlainObject(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  return {};
}

module.exports = createSqliteModel({
  tableName: "homepage_content",
  columns: {
    section: "TEXT",
  },
  uniqueFields: ["section"],
  indexFields: ["section"],
  defaultSort: { section: 1 },
  normalize(payload = {}) {
    const section = asString(payload.section);
    return {
      section,
      payload: asPlainObject(payload.payload),
    };
  },
});

module.exports.ALLOWED_SECTIONS = ALLOWED_SECTIONS;
