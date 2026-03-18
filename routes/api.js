const express = require("express");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const createResourceController = require("../controllers/resourceController");
const { login, me } = require("../controllers/authController");
const { getSiteSettings, updateSiteSettings } = require("../controllers/siteSettingsController");
const { createEnquiry, listEnquiries, updateEnquiry } = require("../controllers/enquiryController");
const { getStats } = require("../controllers/statsController");
const { uploadMedia } = require("../controllers/uploadController");
const upload = require("../middleware/upload");
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
const {
  authLoginValidator,
  siteSettingsValidator,
  serviceCategoryValidator,
  serviceValidator,
  caseStudyValidator,
  clientValidator,
  testimonialValidator,
  blogPostValidator,
  faqValidator,
  teamMemberValidator,
  careerOpeningValidator,
  enquiryValidator,
  enquiryPatchValidator,
} = require("../validators/resourceValidators");

const router = express.Router();

const serviceCategoryController = createResourceController({
  Model: ServiceCategory,
  publicFilter: { isActive: true },
  lookupField: "slug",
});

const serviceController = createResourceController({
  Model: Service,
  publicFilter: { isActive: true },
  lookupField: "slug",
});

const caseStudyController = createResourceController({
  Model: CaseStudy,
  publicFilter: { isActive: true },
  lookupField: "id",
});

const clientController = createResourceController({
  Model: Client,
  publicFilter: { status: "active" },
});

const testimonialController = createResourceController({
  Model: Testimonial,
  publicFilter: { isActive: true },
});

const blogController = createResourceController({
  Model: BlogPost,
  publicFilter: { isPublished: true },
  lookupField: "slug",
  defaultSort: { featured: -1, publishedAt: -1 },
});

const faqController = createResourceController({
  Model: FAQ,
  publicFilter: { isActive: true },
  defaultSort: { page: 1, order: 1, createdAt: -1 },
});

const teamController = createResourceController({
  Model: TeamMember,
  publicFilter: { isActive: true },
});

const careerController = createResourceController({
  Model: CareerOpening,
  publicFilter: { isActive: true },
});

router.post("/auth/login", authLoginValidator, validate, login);
router.get("/auth/me", auth, me);
router.post("/uploads/media", auth, upload.single("file"), uploadMedia);

router.get("/site-settings", getSiteSettings);
router.put("/site-settings", auth, siteSettingsValidator, validate, updateSiteSettings);

router.get("/service-categories", serviceCategoryController.list);
router.get("/admin/service-categories", auth, serviceCategoryController.adminList);
router.post("/service-categories", auth, serviceCategoryValidator, validate, serviceCategoryController.create);
router.put("/service-categories/:id", auth, serviceCategoryValidator, validate, serviceCategoryController.update);
router.delete("/service-categories/:id", auth, serviceCategoryController.remove);

router.get("/services", serviceController.list);
router.get("/services/:slug", serviceController.getOne);
router.get("/admin/services", auth, serviceController.adminList);
router.post("/services", auth, serviceValidator, validate, serviceController.create);
router.put("/services/:id", auth, serviceValidator, validate, serviceController.update);
router.delete("/services/:id", auth, serviceController.remove);

router.get("/case-studies", caseStudyController.list);
router.get("/case-studies/:id", caseStudyController.getOne);
router.get("/admin/case-studies", auth, caseStudyController.adminList);
router.post("/case-studies", auth, caseStudyValidator, validate, caseStudyController.create);
router.put("/case-studies/:id", auth, caseStudyValidator, validate, caseStudyController.update);
router.delete("/case-studies/:id", auth, caseStudyController.remove);

router.get("/clients", clientController.list);
router.get("/admin/clients", auth, clientController.adminList);
router.post("/clients", auth, clientValidator, validate, clientController.create);
router.put("/clients/:id", auth, clientValidator, validate, clientController.update);
router.delete("/clients/:id", auth, clientController.remove);

router.get("/testimonials", testimonialController.list);
router.get("/admin/testimonials", auth, testimonialController.adminList);
router.post("/testimonials", auth, testimonialValidator, validate, testimonialController.create);
router.put("/testimonials/:id", auth, testimonialValidator, validate, testimonialController.update);
router.delete("/testimonials/:id", auth, testimonialController.remove);

router.get("/blogs", blogController.list);
router.get("/blogs/:slug", blogController.getOne);
router.get("/admin/blogs", auth, blogController.adminList);
router.post("/blogs", auth, blogPostValidator, validate, blogController.create);
router.put("/blogs/:id", auth, blogPostValidator, validate, blogController.update);
router.delete("/blogs/:id", auth, blogController.remove);

router.get("/faqs", faqController.list);
router.get("/admin/faqs", auth, faqController.adminList);
router.post("/faqs", auth, faqValidator, validate, faqController.create);
router.put("/faqs/:id", auth, faqValidator, validate, faqController.update);
router.delete("/faqs/:id", auth, faqController.remove);

router.get("/team", teamController.list);
router.get("/admin/team", auth, teamController.adminList);
router.post("/team", auth, teamMemberValidator, validate, teamController.create);
router.put("/team/:id", auth, teamMemberValidator, validate, teamController.update);
router.delete("/team/:id", auth, teamController.remove);

router.get("/careers", careerController.list);
router.get("/admin/careers", auth, careerController.adminList);
router.post("/careers", auth, careerOpeningValidator, validate, careerController.create);
router.put("/careers/:id", auth, careerOpeningValidator, validate, careerController.update);
router.delete("/careers/:id", auth, careerController.remove);

router.post("/contact", enquiryValidator, validate, createEnquiry);
router.get("/enquiries", auth, listEnquiries);
router.patch("/enquiries/:id", auth, enquiryPatchValidator, validate, updateEnquiry);

router.get("/stats", auth, getStats);

module.exports = router;
