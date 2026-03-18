const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const { connectToDatabase } = require("./config/db");
const apiRoutes = require("./routes/api");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    name: "Creative Monk API",
    status: "ok",
    apiBase: "/api",
  });
});

app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  if (err?.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  if (
    err?.code === 11000 ||
    err?.code === "SQLITE_CONSTRAINT_UNIQUE" ||
    /UNIQUE constraint failed/i.test(err?.message || "")
  ) {
    const duplicateField =
      Object.keys(err.keyPattern || {})[0] ||
      (err.message?.split(".").pop() || "field").replace(/["']/g, "");
    return res.status(409).json({
      error: `${duplicateField} must be unique`,
    });
  }

  if (err?.name === "MulterError") {
    return res.status(400).json({
      error: err.message || "Upload failed",
    });
  }

  return res.status(500).json({
    error: err.message || "Something went wrong",
  });
});

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Creative Monk backend running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
