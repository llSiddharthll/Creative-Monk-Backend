const Enquiry = require("../models/Enquiry");
const asyncHandler = require("../utils/asyncHandler");

const listEnquiries = asyncHandler(async (req, res) => {
  const filters = {};

  if (typeof req.query.status === "string") {
    filters.status = req.query.status;
  }

  const enquiries = await Enquiry.findAll({
    filters,
    sort: { createdAt: -1 },
  });

  res.json(enquiries);
});

const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json({
    success: true,
    message: "Your enquiry has been received.",
    enquiry,
  });
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.updateById(req.params.id, req.body);

  if (!enquiry) {
    return res.status(404).json({ error: "Enquiry not found" });
  }

  return res.json(enquiry);
});

module.exports = {
  listEnquiries,
  createEnquiry,
  updateEnquiry,
};
