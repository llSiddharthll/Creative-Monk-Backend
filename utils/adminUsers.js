const bcrypt = require("bcryptjs");

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function buildAdminUsers() {
  const superAdminEmail = normalizeEmail(
    process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL,
  );
  const superAdminPassword =
    process.env.SUPER_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

  const seoAdminEmail = normalizeEmail(process.env.SEO_ADMIN_EMAIL);
  const seoAdminPassword = process.env.SEO_ADMIN_PASSWORD;

  return [
    superAdminEmail && superAdminPassword
      ? {
          email: superAdminEmail,
          password: superAdminPassword,
          role: "super_admin",
          name: process.env.SUPER_ADMIN_NAME || "Creative Monk Super Admin",
        }
      : null,
    seoAdminEmail && seoAdminPassword
      ? {
          email: seoAdminEmail,
          password: seoAdminPassword,
          role: "seo_admin",
          name: process.env.SEO_ADMIN_NAME || "Creative Monk SEO Expert",
        }
      : null,
  ].filter(Boolean);
}

function findAdminUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  return buildAdminUsers().find((user) => user.email === normalizedEmail) || null;
}

function isAdminConfigured() {
  return buildAdminUsers().length > 0;
}

function comparePassword(plainTextPassword, storedPassword) {
  return (
    plainTextPassword === storedPassword ||
    bcrypt.compareSync(plainTextPassword, storedPassword)
  );
}

module.exports = {
  buildAdminUsers,
  comparePassword,
  findAdminUserByEmail,
  isAdminConfigured,
};
