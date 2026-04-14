const { body } = require("express-validator");

const requiredString = (field, label = field) =>
  body(field).trim().notEmpty().withMessage(`${label} is required`);

const optionalString = (field) => body(field).optional().isString().trim();
const optionalBoolean = (field) => body(field).optional().isBoolean();
const optionalNumber = (field) => body(field).optional().isNumeric();
const optionalArray = (field) =>
  body(field).optional().isArray().withMessage(`${field} must be an array`);
const optionalObject = (field) =>
  body(field).optional().isObject().withMessage(`${field} must be an object`);

const authLoginValidator = [
  requiredString("email", "Email").isEmail().withMessage("Email must be valid"),
  requiredString("password", "Password"),
];

const siteSettingsValidator = [
  requiredString("companyName", "Company name"),
  optionalString("legalName"),
  optionalString("tagline"),
  optionalString("description"),
  optionalString("website"),
  optionalString("phone"),
  optionalString("phoneRaw"),
  optionalString("email"),
  optionalString("workingHours"),
  body("yearFounded").optional().isInt({ min: 2000, max: 2100 }),
  optionalObject("address"),
  optionalObject("social"),
  optionalObject("hero"),
  optionalArray("stats"),
  optionalArray("aboutStory"),
  optionalArray("whyChooseUs"),
  optionalArray("values"),
  optionalObject("footerLinks"),
  optionalObject("seoDefaults"),
  optionalObject("sectionToggles"),
];

const serviceCategoryValidator = [
  requiredString("title", "Title"),
  requiredString("slug", "Slug"),
  requiredString("description", "Description"),
  optionalString("icon"),
  optionalNumber("order"),
  optionalBoolean("isActive"),
];

const serviceValidator = [
  requiredString("slug", "Slug"),
  requiredString("title", "Title"),
  requiredString("shortDescription", "Short description"),
  requiredString("longDescription", "Long description"),
  requiredString("category", "Category"),
  optionalString("shortTitle"),
  optionalString("tagline"),
  optionalString("icon"),
  optionalString("image"),
  optionalArray("features"),
  optionalArray("process"),
  optionalArray("outcomes"),
  optionalArray("faqs"),
  optionalObject("detailContent"),
  optionalObject("seo"),
  optionalNumber("order"),
  optionalBoolean("isFeatured"),
  optionalBoolean("isActive"),
];

const caseStudyValidator = [
  requiredString("id", "Case study id"),
  requiredString("title", "Title"),
  requiredString("category", "Category"),
  requiredString("description", "Description"),
  optionalString("client"),
  optionalString("content"),
  optionalArray("services"),
  optionalArray("challenges"),
  optionalArray("solutions"),
  optionalArray("results"),
  optionalArray("metrics"),
  optionalArray("gallery"),
  optionalObject("testimonial"),
  optionalString("link"),
  optionalString("duration"),
  optionalString("image"),
  optionalString("portfolioImage"),
  optionalObject("seo"),
  optionalNumber("order"),
  optionalBoolean("isFeatured"),
  optionalBoolean("isActive"),
];

const clientValidator = [
  requiredString("name", "Name"),
  optionalString("website"),
  optionalString("logo"),
  body("status").optional().isIn(["active", "inactive"]),
  optionalNumber("order"),
  optionalBoolean("isFeatured"),
];

const testimonialValidator = [
  requiredString("name", "Name"),
  requiredString("text", "Testimonial text"),
  optionalString("role"),
  optionalString("company"),
  body("rating").optional().isInt({ min: 1, max: 5 }),
  optionalString("avatar"),
  optionalNumber("order"),
  optionalBoolean("isFeatured"),
  optionalBoolean("isActive"),
];

const blogPostValidator = [
  requiredString("slug", "Slug"),
  requiredString("title", "Title"),
  requiredString("excerpt", "Excerpt"),
  requiredString("content", "Content"),
  requiredString("category", "Category"),
  optionalString("coverImage"),
  optionalArray("tags"),
  optionalString("author"),
  body("publishedAt").optional().isISO8601(),
  optionalString("readTime"),
  optionalBoolean("featured"),
  optionalBoolean("isPublished"),
  optionalObject("seo"),
];

const faqValidator = [
  requiredString("question", "Question"),
  requiredString("answer", "Answer"),
  body("page").optional().isIn(["home", "services", "contact", "about", "general"]),
  optionalNumber("order"),
  optionalBoolean("isActive"),
];

const teamMemberValidator = [
  requiredString("name", "Name"),
  requiredString("role", "Role"),
  optionalString("bio"),
  optionalString("image"),
  optionalObject("social"),
  optionalNumber("order"),
  optionalBoolean("isActive"),
];

const careerOpeningValidator = [
  requiredString("title", "Title"),
  requiredString("department", "Department"),
  requiredString("type", "Type"),
  requiredString("location", "Location"),
  requiredString("experience", "Experience"),
  requiredString("description", "Description"),
  optionalArray("skills"),
  optionalString("applyEmail"),
  optionalBoolean("isActive"),
  optionalNumber("order"),
];

const enquiryValidator = [
  requiredString("name", "Name"),
  requiredString("email", "Email").isEmail().withMessage("Email must be valid"),
  optionalString("phone"),
  optionalString("service"),
  requiredString("message", "Message"),
  optionalString("sourcePage"),
];

const enquiryPatchValidator = [
  body("status").optional().isIn(["new", "in-progress", "responded", "archived"]),
  body("stage").optional().isIn(["new", "qualified", "proposal_sent", "negotiation", "won", "lost"]),
  optionalString("notes"),
  optionalString("assignedTo"),
  body("priority").optional().isIn(["hot", "warm", "cold"]),
  optionalNumber("estimatedValue"),
  optionalString("convertedClientId"),
];

const financeRecordValidator = [
  requiredString("label", "Label"),
  requiredString("periodKey", "Period key"),
  optionalString("currency"),
  optionalNumber("revenue"),
  optionalNumber("expenses"),
  optionalNumber("adSpend"),
  optionalNumber("payroll"),
  optionalNumber("toolsCost"),
  optionalNumber("outstandingInvoices"),
  optionalNumber("cashInHand"),
  optionalNumber("profit"),
  optionalNumber("marginPct"),
  body("status").optional().isIn(["forecast", "actual", "closed"]),
  optionalString("notes"),
  optionalBoolean("isActive"),
];

const employeeValidator = [
  requiredString("name", "Name"),
  requiredString("role", "Role"),
  requiredString("department", "Department"),
  optionalString("email"),
  optionalString("phone"),
  optionalString("avatar"),
  body("status")
    .optional()
    .isIn(["active", "on-leave", "probation", "freelance", "inactive"]),
  body("employmentType")
    .optional()
    .isIn(["full-time", "part-time", "contract", "intern"]),
  optionalNumber("monthlySalary"),
  optionalNumber("utilizationPct"),
  body("ownerLevel").optional().isIn(["lead", "member", "executive"]),
  body("joinedAt").optional().isISO8601(),
  optionalArray("assignedClients"),
  optionalArray("primarySkills"),
  optionalArray("goals"),
  optionalString("notes"),
  optionalNumber("order"),
  optionalBoolean("isActive"),
];

const agencyClientValidator = [
  requiredString("name", "Name"),
  optionalString("website"),
  optionalString("primaryContact"),
  optionalString("contactEmail"),
  optionalString("contactPhone"),
  optionalString("owner"),
  body("status")
    .optional()
    .isIn(["onboarding", "active", "retainer", "paused", "offboarded"]),
  optionalNumber("monthlyRetainer"),
  body("projectHealth").optional().isIn(["green", "amber", "red"]),
  optionalNumber("seoScore"),
  optionalNumber("socialScore"),
  optionalNumber("websiteScore"),
  body("nextReviewDate").optional().isISO8601(),
  optionalArray("services"),
  optionalArray("websitesManaged"),
  optionalArray("priorityGoals"),
  optionalString("notes"),
  optionalBoolean("hasCmsAccess"),
  optionalNumber("order"),
  optionalBoolean("isActive"),
];

const activityValidator = [
  optionalString("leadId"),
  optionalString("clientId"),
  body("type").optional().isIn(["note", "call", "email", "meeting", "stage_change", "system"]),
  optionalString("content"),
];

const followUpValidator = [
  optionalString("leadId"),
  optionalString("clientId"),
  optionalString("title"),
  optionalString("notes"),
  optionalString("dueDate"),
  body("status").optional().isIn(["pending", "done"]),
];

const stageChangeValidator = [
  body("stage").notEmpty().isIn(["new", "qualified", "proposal_sent", "negotiation", "won", "lost"]).withMessage("Valid stage is required"),
];

const assignLeadValidator = [
  requiredString("assignedTo", "Assigned employee"),
];

const clientReviewValidator = [
  optionalString("reviewDate"),
  optionalNumber("seoScore"),
  optionalNumber("socialScore"),
  optionalNumber("websiteScore"),
  body("overallHealth").optional().isIn(["green", "amber", "red"]),
  optionalString("notes"),
];

const portfolioItemValidator = [
  requiredString("title", "Title"),
  optionalString("description"),
  requiredString("category", "Category"),
  optionalString("client"),
  optionalString("duration"),
  optionalString("link"),
  optionalArray("points"),
  optionalString("image"),
  optionalArray("gallery"),
  optionalNumber("order"),
  optionalBoolean("isActive"),
];

module.exports = {
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
  financeRecordValidator,
  employeeValidator,
  agencyClientValidator,
  activityValidator,
  followUpValidator,
  stageChangeValidator,
  assignLeadValidator,
  clientReviewValidator,
  portfolioItemValidator,
};
