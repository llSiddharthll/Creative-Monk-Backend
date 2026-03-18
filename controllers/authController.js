const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;

  if (!adminEmail || !adminPassword || !secret) {
    return res.status(500).json({
      error: "Admin authentication is not configured correctly.",
    });
  }

  const emailMatches = email === adminEmail;
  const passwordMatches =
    password === adminPassword || bcrypt.compareSync(password, adminPassword);

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email: adminEmail, role: "admin" },
    secret,
    { expiresIn: "7d" },
  );

  return res.json({
    token,
    user: {
      email: adminEmail,
      role: "admin",
      name: "Creative Monk Admin",
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
