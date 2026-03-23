const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const bootstrapSuperAdminData = require("../middleware/bootstrapSuperAdminData");
const validate = require("../middleware/validate");
const createResourceController = require("../controllers/resourceController");
const { login, me } = require("../controllers/authController");
const { getSiteSettings, updateSiteSettings } = require("../controllers/siteSettingsController");
const { createEnquiry, listEnquiries, updateEnquiry } = require("../controllers/enquiryController");
const { getStats } = require("../controllers/statsController");
const { getSuperAdminOverview } = require("../controllers/superAdminController");
const { listActivities, createActivity } = require("../controllers/activityController");
const { listFollowUps, createFollowUp, updateFollowUp } = require("../controllers/followUpController");
const { getPipeline, changeStage, assignLead, convertToClient } = require("../controllers/leadPipelineController");
const { getFinanceSummary, getExpenseBreakdown, getClientBreakdown, getPnl } = require("../controllers/financeAnalyticsController");
const { getEmployeeSummary, getUtilization, getDepartmentStats } = require("../controllers/employeeAnalyticsController");
const { getClientDetail, listClientReviews, createClientReview } = require("../controllers/clientProfileController");
const { uploadMedia } = require("../controllers/uploadController");
const upload = require("../middleware/upload");
const AgencyClient = require("../models/AgencyClient");
const SiteSettings = require("../models/SiteSettings");
const Employee = require("../models/Employee");
const Enquiry = require("../models/Enquiry");
const FinanceRecord = require("../models/FinanceRecord");
const ServiceCategory = require("../models/ServiceCategory");
const Service = require("../models/Service");
const CaseStudy = require("../models/CaseStudy");
const Client = require("../models/Client");
const Testimonial = require("../models/Testimonial");
const BlogPost = require("../models/BlogPost");
const FAQ = require("../models/FAQ");
const TeamMember = require("../models/TeamMember");
const CareerOpening = require("../models/CareerOpening");
const Activity = require("../models/Activity");
const FollowUp = require("../models/FollowUp");
const ClientReview = require("../models/ClientReview");
const seedData = require("../seed/seedData");
const { connectToDatabase } = require("../config/db");
const {
  authLoginValidator,
  agencyClientValidator,
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
  employeeValidator,
  financeRecordValidator,
  activityValidator,
  followUpValidator,
  stageChangeValidator,
  assignLeadValidator,
  clientReviewValidator,
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

const financeRecordController = createResourceController({
  Model: FinanceRecord,
  publicFilter: { isActive: true },
  defaultSort: { periodKey: 1, createdAt: -1 },
});

const employeeController = createResourceController({
  Model: Employee,
  publicFilter: { isActive: true },
});

const agencyClientController = createResourceController({
  Model: AgencyClient,
  publicFilter: { isActive: true },
});

const cmsAccess = [auth, authorize("seo_admin", "super_admin")];
const superAccess = [auth, authorize("super_admin"), bootstrapSuperAdminData];

router.post("/auth/login", authLoginValidator, validate, login);
router.get("/auth/me", auth, me);
router.post("/uploads/media", ...cmsAccess, upload.single("file"), uploadMedia);

router.get("/site-settings", getSiteSettings);
router.put("/site-settings", ...cmsAccess, siteSettingsValidator, validate, updateSiteSettings);

router.get("/service-categories", serviceCategoryController.list);
router.get("/admin/service-categories", ...cmsAccess, serviceCategoryController.adminList);
router.post("/service-categories", ...cmsAccess, serviceCategoryValidator, validate, serviceCategoryController.create);
router.put("/service-categories/:id", ...cmsAccess, serviceCategoryValidator, validate, serviceCategoryController.update);
router.delete("/service-categories/:id", ...cmsAccess, serviceCategoryController.remove);

router.get("/services", serviceController.list);
router.get("/services/:slug", serviceController.getOne);
router.get("/admin/services", ...cmsAccess, serviceController.adminList);
router.post("/services", ...cmsAccess, serviceValidator, validate, serviceController.create);
router.put("/services/:id", ...cmsAccess, serviceValidator, validate, serviceController.update);
router.delete("/services/:id", ...cmsAccess, serviceController.remove);

router.get("/case-studies", caseStudyController.list);
router.get("/case-studies/:id", caseStudyController.getOne);
router.get("/admin/case-studies", ...cmsAccess, caseStudyController.adminList);
router.post("/case-studies", ...cmsAccess, caseStudyValidator, validate, caseStudyController.create);
router.put("/case-studies/:id", ...cmsAccess, caseStudyValidator, validate, caseStudyController.update);
router.delete("/case-studies/:id", ...cmsAccess, caseStudyController.remove);

router.get("/clients", clientController.list);
router.get("/admin/clients", ...cmsAccess, clientController.adminList);
router.post("/clients", ...cmsAccess, clientValidator, validate, clientController.create);
router.put("/clients/:id", ...cmsAccess, clientValidator, validate, clientController.update);
router.delete("/clients/:id", ...cmsAccess, clientController.remove);

router.get("/testimonials", testimonialController.list);
router.get("/admin/testimonials", ...cmsAccess, testimonialController.adminList);
router.post("/testimonials", ...cmsAccess, testimonialValidator, validate, testimonialController.create);
router.put("/testimonials/:id", ...cmsAccess, testimonialValidator, validate, testimonialController.update);
router.delete("/testimonials/:id", ...cmsAccess, testimonialController.remove);

router.get("/blogs", blogController.list);
router.get("/blogs/:slug", blogController.getOne);
router.get("/admin/blogs", ...cmsAccess, blogController.adminList);
router.post("/blogs", ...cmsAccess, blogPostValidator, validate, blogController.create);
router.put("/blogs/:id", ...cmsAccess, blogPostValidator, validate, blogController.update);
router.delete("/blogs/:id", ...cmsAccess, blogController.remove);

router.get("/faqs", faqController.list);
router.get("/admin/faqs", ...cmsAccess, faqController.adminList);
router.post("/faqs", ...cmsAccess, faqValidator, validate, faqController.create);
router.put("/faqs/:id", ...cmsAccess, faqValidator, validate, faqController.update);
router.delete("/faqs/:id", ...cmsAccess, faqController.remove);

router.get("/team", teamController.list);
router.get("/admin/team", ...cmsAccess, teamController.adminList);
router.post("/team", ...cmsAccess, teamMemberValidator, validate, teamController.create);
router.put("/team/:id", ...cmsAccess, teamMemberValidator, validate, teamController.update);
router.delete("/team/:id", ...cmsAccess, teamController.remove);

router.get("/careers", careerController.list);
router.get("/admin/careers", ...cmsAccess, careerController.adminList);
router.post("/careers", ...cmsAccess, careerOpeningValidator, validate, careerController.create);
router.put("/careers/:id", ...cmsAccess, careerOpeningValidator, validate, careerController.update);
router.delete("/careers/:id", ...cmsAccess, careerController.remove);

router.post("/contact", enquiryValidator, validate, createEnquiry);
router.get("/enquiries", ...cmsAccess, listEnquiries);
router.patch("/enquiries/:id", ...cmsAccess, enquiryPatchValidator, validate, updateEnquiry);

router.get("/stats", ...cmsAccess, getStats);

router.get("/admin/finance-records", ...superAccess, financeRecordController.adminList);
router.post("/finance-records", ...superAccess, financeRecordValidator, validate, financeRecordController.create);
router.put("/finance-records/:id", ...superAccess, financeRecordValidator, validate, financeRecordController.update);
router.delete("/finance-records/:id", ...superAccess, financeRecordController.remove);

router.get("/admin/employees", ...superAccess, employeeController.adminList);
router.post("/employees", ...superAccess, employeeValidator, validate, employeeController.create);
router.put("/employees/:id", ...superAccess, employeeValidator, validate, employeeController.update);
router.delete("/employees/:id", ...superAccess, employeeController.remove);

router.get("/admin/agency-clients", ...superAccess, agencyClientController.adminList);
router.post("/agency-clients", ...superAccess, agencyClientValidator, validate, agencyClientController.create);
router.put("/agency-clients/:id", ...superAccess, agencyClientValidator, validate, agencyClientController.update);
router.delete("/agency-clients/:id", ...superAccess, agencyClientController.remove);

router.get("/super-admin/overview", ...superAccess, getSuperAdminOverview);

// ── Lead Pipeline ──
router.get("/super-admin/leads/pipeline", ...superAccess, getPipeline);
router.patch("/enquiries/:id/stage", ...superAccess, stageChangeValidator, validate, changeStage);
router.patch("/enquiries/:id/assign", ...superAccess, assignLeadValidator, validate, assignLead);
router.post("/super-admin/leads/:id/convert", ...superAccess, convertToClient);

// ── Activities ──
router.get("/activities", ...superAccess, listActivities);
router.post("/activities", ...superAccess, activityValidator, validate, createActivity);

// ── Follow-ups ──
router.get("/follow-ups", ...superAccess, listFollowUps);
router.post("/follow-ups", ...superAccess, followUpValidator, validate, createFollowUp);
router.patch("/follow-ups/:id", ...superAccess, followUpValidator, validate, updateFollowUp);

// ── Client Profile ──
router.get("/agency-clients/:id/detail", ...superAccess, getClientDetail);
router.get("/agency-clients/:id/reviews", ...superAccess, listClientReviews);
router.post("/agency-clients/:id/reviews", ...superAccess, clientReviewValidator, validate, createClientReview);

// ── Finance Analytics ──
router.get("/super-admin/finance/summary", ...superAccess, getFinanceSummary);
router.get("/super-admin/finance/expense-breakdown", ...superAccess, getExpenseBreakdown);
router.get("/super-admin/finance/client-breakdown", ...superAccess, getClientBreakdown);
router.get("/super-admin/finance/pnl", ...superAccess, getPnl);

// ── Employee Analytics ──
router.get("/super-admin/employees/summary", ...superAccess, getEmployeeSummary);
router.get("/super-admin/employees/utilization", ...superAccess, getUtilization);
router.get("/super-admin/employees/department-stats", ...superAccess, getDepartmentStats);

router.post("/seed", ...superAccess, async (req, res, next) => {
  try {
    await connectToDatabase();

    await Promise.all([
      AgencyClient.clear(),
      Employee.clear(),
      Enquiry.clear(),
      FinanceRecord.clear(),
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
    await AgencyClient.bulkCreate(seedData.agencyClients || []);
    await Employee.bulkCreate(seedData.employees || []);
    await Enquiry.bulkCreate(seedData.enquiries || []);
    await FinanceRecord.bulkCreate(seedData.financeRecords || []);

    res.json({ message: "Seed completed successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
