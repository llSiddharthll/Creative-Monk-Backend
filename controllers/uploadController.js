const path = require("path");
const { ensureCloudinaryConfigured } = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const { createHttpError } = require("../utils/httpError");

function normalizeFolder(folder = "") {
  const cleaned = String(folder)
    .trim()
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/|\/$/g, "");

  return cleaned || "creative-monk";
}

function normalizePublicId(value = "") {
  return String(value)
    .trim()
    .replace(/[^a-zA-Z0-9/_-]/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/|\/$/g, "");
}

function inferResourceType(file) {
  if (!file?.mimetype) {
    return "auto";
  }

  if (file.mimetype.startsWith("image/")) {
    return "image";
  }

  if (file.mimetype.startsWith("video/")) {
    return "video";
  }

  return "auto";
}

const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, "A file is required.");
  }

  const cloudinary = ensureCloudinaryConfigured();
  const folder = normalizeFolder(req.body.folder || "creative-monk/uploads");
  const publicIdInput =
    req.body.publicId ||
    path.parse(req.file.originalname || "media").name ||
    `upload-${Date.now()}`;
  const publicId = normalizePublicId(publicIdInput);
  const resourceType = req.body.resourceType || inferResourceType(req.file);

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
      },
      (error, response) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(response);
      },
    );

    stream.end(req.file.buffer);
  });

  res.status(201).json({
    url: result.secure_url,
    secureUrl: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    format: result.format,
    width: result.width ?? null,
    height: result.height ?? null,
    bytes: result.bytes,
    originalFilename: req.file.originalname,
  });
});

module.exports = {
  uploadMedia,
};
