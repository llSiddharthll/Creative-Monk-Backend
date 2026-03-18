const multer = require("multer");
const { createHttpError } = require("../utils/httpError");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (!file.mimetype) {
      callback(createHttpError(400, "Invalid upload type."));
      return;
    }

    callback(null, true);
  },
});

module.exports = upload;
