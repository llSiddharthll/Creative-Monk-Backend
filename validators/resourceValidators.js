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
  optionalString("notes"),
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
};
