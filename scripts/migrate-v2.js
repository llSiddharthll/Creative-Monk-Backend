require("dotenv").config();
const { getDatabase } = require("../config/db");

async function migrate() {
  const db = getDatabase();
  
  const columnsToAdd = [
    { name: "stage", type: "TEXT" },
    { name: "assignedTo", type: "TEXT" },
    { name: "priority", type: "TEXT" },
    { name: "estimatedValue", type: "REAL" },
    { name: "convertedClientId", type: "TEXT" },
  ];

  for (const col of columnsToAdd) {
    try {
      await db.execute(`ALTER TABLE "enquiries" ADD COLUMN "${col.name}" ${col.type}`);
      console.log(`Added column ${col.name}`);
    } catch (err) {
      if (err.message && err.message.includes("duplicate column")) {
        console.log(`Column ${col.name} already exists, skipping`);
      } else {
        console.log(`Column ${col.name}: ${err.message}`);
      }
    }
  }

  // Backfill stage from status
  try {
    await db.execute(`UPDATE "enquiries" SET stage = CASE status WHEN 'new' THEN 'new' WHEN 'in-progress' THEN 'qualified' WHEN 'responded' THEN 'proposal_sent' WHEN 'archived' THEN 'lost' ELSE 'new' END WHERE stage IS NULL`);
    console.log("Backfilled stage from status");
  } catch (err) {
    console.log("Backfill:", err.message);
  }

  // Set defaults
  try {
    await db.execute(`UPDATE "enquiries" SET priority = 'cold' WHERE priority IS NULL`);
    await db.execute(`UPDATE "enquiries" SET estimatedValue = 0 WHERE estimatedValue IS NULL`);
    console.log("Set defaults for priority and estimatedValue");
  } catch (err) {
    console.log("Defaults:", err.message);
  }

  // Create indexes
  try {
    await db.execute(`CREATE INDEX IF NOT EXISTS "idx_enquiries_stage" ON "enquiries" ("stage")`);
    await db.execute(`CREATE INDEX IF NOT EXISTS "idx_enquiries_assignedTo" ON "enquiries" ("assignedTo")`);
    console.log("Created indexes");
  } catch (err) {
    console.log("Indexes:", err.message);
  }

  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
