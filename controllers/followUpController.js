const asyncHandler = require("../utils/asyncHandler");
const FollowUp = require("../models/FollowUp");

const listFollowUps = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.leadId) filters.leadId = req.query.leadId;
  if (req.query.clientId) filters.clientId = req.query.clientId;
  if (req.query.status) filters.status = req.query.status;
  const followUps = await FollowUp.findAll({ filters, sort: { dueDate: 1 } });
  // Compute isOverdue for each
  const now = new Date();
  const enriched = followUps.map((f) => ({
    ...f,
    isOverdue: f.status === "pending" && new Date(f.dueDate) < now,
  }));
  res.json(enriched);
});

const createFollowUp = asyncHandler(async (req, res) => {
  const followUp = await FollowUp.create({
    ...req.body,
    createdBy: req.user?.email || "system",
  });
  res.status(201).json(followUp);
});

const updateFollowUp = asyncHandler(async (req, res) => {
  const updated = await FollowUp.updateById(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Follow-up not found" });
  return res.json(updated);
});

module.exports = { listFollowUps, createFollowUp, updateFollowUp };
