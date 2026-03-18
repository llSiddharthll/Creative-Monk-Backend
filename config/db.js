const { createClient } = require("@libsql/client");
require("dotenv").config();

let databaseInstance;

function getDatabase() {
  if (!databaseInstance) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error("TURSO_DATABASE_URL is not defined in environment variables");
    }

    databaseInstance = createClient({
      url: url,
      authToken: authToken,
    });
  }

  return databaseInstance;
}

function resolveDatabasePath() {
  return process.env.TURSO_DATABASE_URL || "unknown";
}

async function connectToDatabase() {
  return getDatabase();
}

module.exports = {
  connectToDatabase,
  getDatabase,
  resolveDatabasePath,
};
