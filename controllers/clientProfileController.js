const asyncHandler = require("../utils/asyncHandler");
const AgencyClient = require("../models/AgencyClient");
const ClientReview = require("../models/ClientReview");

const getClientDetail = asyncHandler(async (req, res) => {
  const client = await AgencyClient.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });
  return res.json(client);
});

const listClientReviews = asyncHandler(async (req, res) => {
  const reviews = await ClientReview.findAll({
    filters: { clientId: req.params.id },
    sort: { reviewDate: -1 },
  });
  res.json(reviews);
});

const createClientReview = asyncHandler(async (req, res) => {
  const review = await ClientReview.create({
    ...req.body,
    clientId: req.params.id,
    reviewedBy: req.user?.email || "system",
  });
  res.status(201).json(review);
});

module.exports = { getClientDetail, listClientReviews, createClientReview };
