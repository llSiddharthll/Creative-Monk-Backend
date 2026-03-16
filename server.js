const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));

// ─── Data Store ─────────────────────────────────────────────────────
const DB_PATH = path.join(__dirname, "data", "db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ─── Auth Middleware ────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ─── Auth Routes ────────────────────────────────────────────────────
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({
      token,
      user: { email, role: "admin", name: "Admin" },
    });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// ─── Generic CRUD Helper ────────────────────────────────────────────
function createCRUD(resourceKey, idField = "id") {
  const router = express.Router();

  // GET all
  router.get("/", (req, res) => {
    const db = readDB();
    res.json(db[resourceKey] || []);
  });

  // GET one
  router.get("/:id", (req, res) => {
    const db = readDB();
    const item = (db[resourceKey] || []).find(
      (i) => i[idField] === req.params.id
    );
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  });

  // POST create
  router.post("/", authMiddleware, (req, res) => {
    const db = readDB();
    if (!db[resourceKey]) db[resourceKey] = [];
    const newItem = { ...req.body, createdAt: new Date().toISOString() };
    db[resourceKey].push(newItem);
    writeDB(db);
    res.status(201).json(newItem);
  });

  // PUT update
  router.put("/:id", authMiddleware, (req, res) => {
    const db = readDB();
    const index = (db[resourceKey] || []).findIndex(
      (i) => i[idField] === req.params.id
    );
    if (index === -1) return res.status(404).json({ error: "Not found" });
    db[resourceKey][index] = {
      ...db[resourceKey][index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    writeDB(db);
    res.json(db[resourceKey][index]);
  });

  // DELETE
  router.delete("/:id", authMiddleware, (req, res) => {
    const db = readDB();
    const index = (db[resourceKey] || []).findIndex(
      (i) => i[idField] === req.params.id
    );
    if (index === -1) return res.status(404).json({ error: "Not found" });
    const deleted = db[resourceKey].splice(index, 1);
    writeDB(db);
    res.json(deleted[0]);
  });

  return router;
}

// ─── API Routes ─────────────────────────────────────────────────────
app.use("/api/portfolio", createCRUD("portfolio", "id"));
app.use("/api/projects", createCRUD("portfolio", "id")); // alias
app.use("/api/services", createCRUD("services", "slug"));
app.use("/api/testimonials", createCRUD("testimonials", "id"));
app.use("/api/blogs", createCRUD("blogs", "slug"));
app.use("/api/enquiries", createCRUD("enquiries", "id"));
app.use("/api/careers", createCRUD("careers", "id"));
app.use("/api/clients", createCRUD("clients", "id"));

// Contact form (public, no auth needed)
app.post("/api/contact", (req, res) => {
  const db = readDB();
  if (!db.enquiries) db.enquiries = [];
  const enquiry = {
    id: "enq-" + Date.now(),
    ...req.body,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  db.enquiries.push(enquiry);
  writeDB(db);
  res.status(201).json({ success: true, message: "Enquiry submitted!" });
});

// Dashboard stats
app.get("/api/stats", authMiddleware, (req, res) => {
  const db = readDB();
  res.json({
    services: (db.services || []).length,
    portfolio: (db.portfolio || []).length,
    testimonials: (db.testimonials || []).length,
    blogs: (db.blogs || []).length,
    enquiries: (db.enquiries || []).length,
    careers: (db.careers || []).filter((c) => c.active).length,
    newEnquiries: (db.enquiries || []).filter((e) => e.status === "new").length,
    clients: (db.clients || []).length,
  });
});

// ─── Serve Admin Dashboard ──────────────────────────────────────────
app.use("/admin", express.static(path.join(__dirname, "admin")));
app.get("/admin/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "index.html"));
});

// ─── Root ───────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Creative Monk Backend API",
    admin: "/admin",
    endpoints: [
      "GET /api/services",
      "GET /api/portfolio",
      "GET /api/testimonials",
      "GET /api/blogs",
      "GET /api/careers",
      "GET /api/clients",
      "GET /api/enquiries (auth)",
      "POST /api/contact",
      "POST /api/auth/login",
    ],
  });
});

// ─── Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Creative Monk Backend running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`📡 API Endpoints: http://localhost:${PORT}/api\n`);
});
