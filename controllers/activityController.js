const asyncHandler = require("../utils/asyncHandler");
const Activity = require("../models/Activity");

const listActivities = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.leadId) filters.leadId = req.query.leadId;
  if (req.query.clientId) filters.clientId = req.query.clientId;
  if (req.query.type) filters.type = req.query.type;
  const activities = await Activity.findAll({ filters, sort: { createdAt: -1 } });
  res.json(activities);
});

const createActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.create({
    ...req.body,
    createdBy: req.user?.email || "system",
  });
  res.status(201).json(activity);
});

module.exports = { listActivities, createActivity };
