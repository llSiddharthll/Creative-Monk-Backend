const SiteSettings = require("../models/SiteSettings");
const asyncHandler = require("../utils/asyncHandler");

const SETTINGS_KEY = "main-site-settings";

const getSiteSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOne({ singletonKey: SETTINGS_KEY });

  if (!settings) {
    return res.status(404).json({ error: "Site settings not found" });
  }

  return res.json(settings);
});

const updateSiteSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.upsertByField("singletonKey", SETTINGS_KEY, {
    ...req.body,
    singletonKey: SETTINGS_KEY,
  });

  return res.json(settings);
});

module.exports = {
  getSiteSettings,
  updateSiteSettings,
};
