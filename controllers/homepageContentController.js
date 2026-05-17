const asyncHandler = require("../utils/asyncHandler");
const HomepageContent = require("../models/HomepageContent");
const { createHttpError } = require("../utils/httpError");

const { ALLOWED_SECTIONS } = HomepageContent;

function ensureValidSection(section) {
  if (!ALLOWED_SECTIONS.has(section)) {
    throw createHttpError(400, `Unknown homepage section: ${section}`);
  }
}

const getSection = asyncHandler(async (req, res) => {
  const { section } = req.params;
  ensureValidSection(section);

  const doc = await HomepageContent.findOne({ section });
  if (!doc) {
    return res.json({ section, payload: null });
  }

  return res.json({ section: doc.section, payload: doc.payload || null });
});

const listSections = asyncHandler(async (_req, res) => {
  const docs = await HomepageContent.findAll();
  const map = {};
  docs.forEach((doc) => {
    map[doc.section] = doc.payload || null;
  });
  res.json(map);
});

const upsertSection = asyncHandler(async (req, res) => {
  const { section } = req.params;
  ensureValidSection(section);

  const payload = req.body?.payload;
  if (payload === undefined || payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw createHttpError(400, "payload must be a JSON object");
  }

  const doc = await HomepageContent.upsertByField("section", section, {
    section,
    payload,
  });

  res.json({ section: doc.section, payload: doc.payload || null });
});

module.exports = {
  getSection,
  listSections,
  upsertSection,
};
