const asyncHandler = require("../utils/asyncHandler");
const Service = require("../models/Service");
const CaseStudy = require("../models/CaseStudy");
const BlogPost = require("../models/BlogPost");
const Enquiry = require("../models/Enquiry");
const Client = require("../models/Client");
const Testimonial = require("../models/Testimonial");
const CareerOpening = require("../models/CareerOpening");

const getStats = asyncHandler(async (req, res) => {
  const [
    services,
    caseStudies,
    blogs,
    enquiries,
    newEnquiries,
    clients,
    testimonials,
    careers,
  ] = await Promise.all([
    Service.count({ isActive: true }),
    CaseStudy.count({ isActive: true }),
    BlogPost.count({ isPublished: true }),
    Enquiry.count(),
    Enquiry.count({ status: "new" }),
    Client.count({ status: "active" }),
    Testimonial.count({ isActive: true }),
    CareerOpening.count({ isActive: true }),
  ]);

  res.json({
    services,
    caseStudies,
    blogs,
    enquiries,
    newEnquiries,
    clients,
    testimonials,
    careers,
  });
});

module.exports = {
  getStats,
};
