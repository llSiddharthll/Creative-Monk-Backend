require("dotenv").config();

const { connectToDatabase, resolveDatabasePath } = require("../config/db");
const SiteSettings = require("../models/SiteSettings");
const ServiceCategory = require("../models/ServiceCategory");
const Service = require("../models/Service");
const CaseStudy = require("../models/CaseStudy");
const Client = require("../models/Client");
const Testimonial = require("../models/Testimonial");
const BlogPost = require("../models/BlogPost");
const FAQ = require("../models/FAQ");
const TeamMember = require("../models/TeamMember");
const CareerOpening = require("../models/CareerOpening");
const Enquiry = require("../models/Enquiry");
const seedData = require("../seed/seedData");

async function seed() {
  await connectToDatabase();

  await Promise.all([
    SiteSettings.clear(),
    ServiceCategory.clear(),
    Service.clear(),
    CaseStudy.clear(),
    Client.clear(),
    Testimonial.clear(),
    BlogPost.clear(),
    FAQ.clear(),
    TeamMember.clear(),
    CareerOpening.clear(),
    Enquiry.clear(),
  ]);

  await SiteSettings.create(seedData.siteSettings);
  await ServiceCategory.bulkCreate(seedData.serviceCategories);
  await Service.bulkCreate(seedData.services);
  await CaseStudy.bulkCreate(seedData.caseStudies);
  await Client.bulkCreate(seedData.clients);
  await Testimonial.bulkCreate(seedData.testimonials);
  await BlogPost.bulkCreate(seedData.blogs);
  await FAQ.bulkCreate(seedData.faqs);
  await TeamMember.bulkCreate(seedData.team);
  await CareerOpening.bulkCreate(seedData.careers);

  console.log(`Creative Monk seed completed successfully at ${resolveDatabasePath()}.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
