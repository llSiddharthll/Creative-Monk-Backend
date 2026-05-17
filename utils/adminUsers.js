const bcrypt = require("bcryptjs");

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

/* One admin — the SEO workspace is the only workspace. Credentials come
   from SUPER_ADMIN_* env vars; ADMIN_* and SEO_ADMIN_* are no longer
   read. The role string stays "super_admin" because every backend route
   gate (cmsAccess, superAccess) accepts it. */
function buildAdminUsers() {
  const email = normalizeEmail(process.env.SUPER_ADMIN_EMAIL);
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    return [];
  }

  return [
    {
      email,
      password,
      role: "super_admin",
      name: process.env.SUPER_ADMIN_NAME || "Creative Monk Admin",
    },
  ];
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
