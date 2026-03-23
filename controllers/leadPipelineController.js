const asyncHandler = require("../utils/asyncHandler");
const Enquiry = require("../models/Enquiry");
const Activity = require("../models/Activity");
const AgencyClient = require("../models/AgencyClient");

const getPipeline = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.findAll({ sort: { createdAt: -1 } });
  const stages = ["new", "qualified", "proposal_sent", "negotiation", "won", "lost"];
  const pipeline = stages.map((stage) => ({
    stage,
    leads: enquiries.filter((e) => (e.stage || "new") === stage),
    count: enquiries.filter((e) => (e.stage || "new") === stage).length,
  }));
  res.json(pipeline);
});

const changeStage = asyncHandler(async (req, res) => {
  const { stage } = req.body;
  if (!stage) return res.status(400).json({ error: "Stage is required" });

  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ error: "Lead not found" });

  const oldStage = enquiry.stage || "new";
  const updated = await Enquiry.updateById(req.params.id, { stage });

  // Auto-log activity
  await Activity.create({
    leadId: enquiry._id,
    type: "stage_change",
    content: `Stage changed from ${oldStage} to ${stage}`,
    metadata: { from: oldStage, to: stage },
    createdBy: req.user?.email || "system",
  });

  return res.json(updated);
});

const assignLead = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ error: "Lead not found" });

  const updated = await Enquiry.updateById(req.params.id, { assignedTo });

  await Activity.create({
    leadId: enquiry._id,
    type: "system",
    content: `Lead assigned to ${assignedTo}`,
    metadata: { assignedTo },
    createdBy: req.user?.email || "system",
  });

  return res.json(updated);
});

const convertToClient = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ error: "Lead not found" });
  if ((enquiry.stage || "new") !== "won") {
    return res.status(400).json({ error: "Only won leads can be converted" });
  }

  const client = await AgencyClient.create({
    name: enquiry.name,
    contactEmail: enquiry.email,
    contactPhone: enquiry.phone || "",
    status: "onboarding",
    projectHealth: "green",
    notes: `Converted from lead. Original service interest: ${enquiry.service || "N/A"}`,
  });

  await Enquiry.updateById(req.params.id, { convertedClientId: client._id });

  await Activity.create({
    leadId: enquiry._id,
    clientId: client._id,
    type: "system",
    content: `Lead converted to client: ${client.name}`,
    createdBy: req.user?.email || "system",
  });

  return res.json({ success: true, client });
});

module.exports = { getPipeline, changeStage, assignLead, convertToClient };
