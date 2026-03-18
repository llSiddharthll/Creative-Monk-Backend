const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

let databaseInstance;

function resolveDatabasePath() {
  const configuredPath = process.env.SQLITE_PATH || "./data/creative-monk.sqlite";

  if (path.isAbsolute(configuredPath)) {
    return configuredPath;
  }

  return path.resolve(__dirname, "..", configuredPath);
}

function getDatabase() {
  if (!databaseInstance) {
    const databasePath = resolveDatabasePath();
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });

    databaseInstance = new Database(databasePath);
    databaseInstance.pragma("journal_mode = WAL");
    databaseInstance.pragma("foreign_keys = ON");
  }

  return databaseInstance;
}

async function connectToDatabase() {
  return getDatabase();
}

module.exports = {
  connectToDatabase,
  getDatabase,
  resolveDatabasePath,
};
