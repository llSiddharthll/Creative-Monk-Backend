const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const {
  comparePassword,
  findAdminUserByEmail,
  isAdminConfigured,
} = require("../utils/adminUsers");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const secret = process.env.JWT_SECRET;

  if (!isAdminConfigured() || !secret) {
    return res.status(500).json({
      error: "Admin authentication is not configured correctly.",
    });
  }

  const adminUser = findAdminUserByEmail(email);
  const passwordMatches = adminUser
    ? comparePassword(password, adminUser.password)
    : false;

  if (!adminUser || !passwordMatches) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email: adminUser.email, role: adminUser.role, name: adminUser.name },
    secret,
    { expiresIn: "7d" },
  );

  return res.json({
    token,
    user: {
      email: adminUser.email,
      role: adminUser.role,
      name: adminUser.name,
    },
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = {
  login,
  me,
};
