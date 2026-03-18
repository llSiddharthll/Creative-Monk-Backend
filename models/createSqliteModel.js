const { getDatabase } = require("../config/db");
const { createHttpError } = require("../utils/httpError");

const initializedTables = new Set();

function quoteIdentifier(identifier) {
  return `"${String(identifier).replace(/"/g, '""')}"`;
}

function toColumnValue(value, type) {
  if (value === undefined || value === null) {
    return null;
  }

  if (type === "INTEGER") {
    return typeof value === "boolean" ? Number(value) : Number(value);
  }

  if (type === "REAL") {
    return Number(value);
  }

  return String(value);
}

function buildWhereClause(filters, columns) {
  const clauses = [];
  const params = [];

  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || !(key in columns)) {
      return;
    }

    clauses.push(`${quoteIdentifier(key)} = ?`);
    params.push(toColumnValue(value, columns[key]));
  });

  return {
    sql: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    params,
  };
}

function buildOrderClause(sort, columns) {
  const entries = Object.entries(sort || {}).filter(([key, direction]) => {
    return direction && (key in columns || key === "createdAt" || key === "updatedAt");
  });

  if (!entries.length) {
    return "";
  }

  const normalized = entries.map(([key, direction]) => {
    const order = Number(direction) === -1 ? "DESC" : "ASC";
    return `${quoteIdentifier(key)} ${order}`;
  });

  return `ORDER BY ${normalized.join(", ")}`;
}

async function ensureTable(config) {
  if (initializedTables.has(config.tableName)) {
    return;
  }

  const db = getDatabase();
  const columnDefinitions = [
    '"pk" INTEGER PRIMARY KEY AUTOINCREMENT',
    '"data" TEXT NOT NULL',
    '"createdAt" TEXT NOT NULL',
    '"updatedAt" TEXT NOT NULL',
    ...Object.entries(config.columns).map(([name, type]) => `${quoteIdentifier(name)} ${type}`),
  ];

  await db.execute(
    `CREATE TABLE IF NOT EXISTS ${quoteIdentifier(config.tableName)} (${columnDefinitions.join(", ")})`
  );

  for (const field of config.uniqueFields || []) {
    await db.execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS ${quoteIdentifier(
        `idx_${config.tableName}_${field}_unique`
      )} ON ${quoteIdentifier(config.tableName)} (${quoteIdentifier(field)})`
    );
  }

  for (const field of config.indexFields || []) {
    await db.execute(
      `CREATE INDEX IF NOT EXISTS ${quoteIdentifier(
        `idx_${config.tableName}_${field}`
      )} ON ${quoteIdentifier(config.tableName)} (${quoteIdentifier(field)})`
    );
  }

  initializedTables.add(config.tableName);
}

function parseRow(row) {
  if (!row) {
    return null;
  }

  const parsed = JSON.parse(row.data);

  return {
    ...parsed,
    _id: String(row.pk),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapDocumentToRow(document, config) {
  const row = {};

  Object.entries(config.columns).forEach(([field, type]) => {
    row[field] = toColumnValue(document[field], type);
  });

  return row;
}

function createSqliteModel(config) {
  const modelConfig = {
    defaultSort: { order: 1, createdAt: -1 },
    uniqueFields: [],
    indexFields: [],
    ...config,
  };

  const model = {
    tableName: modelConfig.tableName,
    fields: modelConfig.columns,

    async findAll({ filters = {}, sort = modelConfig.defaultSort, limit } = {}) {
      await ensureTable(modelConfig);
      const db = getDatabase();
      const where = buildWhereClause(filters, modelConfig.columns);
      const orderBy = buildOrderClause(sort, modelConfig.columns);
      const limitClause =
        Number.isFinite(Number(limit)) && Number(limit) > 0 ? `LIMIT ${Number(limit)}` : "";

      const sql = [
        `SELECT * FROM ${quoteIdentifier(modelConfig.tableName)}`,
        where.sql,
        orderBy,
        limitClause,
      ]
        .filter(Boolean)
        .join(" ");

      const result = await db.execute({ sql, args: where.params });
      return result.rows.map(parseRow);
    },

    async findOne(filters = {}, { sort = modelConfig.defaultSort } = {}) {
      const items = await model.findAll({ filters, sort, limit: 1 });
      return items[0] || null;
    },

    async findById(id) {
      await ensureTable(modelConfig);
      const db = getDatabase();
      const result = await db.execute({
        sql: `SELECT * FROM ${quoteIdentifier(modelConfig.tableName)} WHERE "pk" = ?`,
        args: [Number(id)],
      });
      return parseRow(result.rows[0]);
    },

    async create(payload) {
      await ensureTable(modelConfig);
      const db = getDatabase();
      const now = new Date().toISOString();
      const document = modelConfig.normalize(payload, { isNew: true });
      const row = mapDocumentToRow(document, modelConfig);

      const columns = ["data", "createdAt", "updatedAt", ...Object.keys(modelConfig.columns)];
      const placeholders = columns.map(() => "?").join(", ");
      const values = [
        JSON.stringify(document),
        now,
        now,
        ...Object.keys(modelConfig.columns).map((field) => row[field]),
      ];

      try {
        const result = await db.execute({
          sql: `INSERT INTO ${quoteIdentifier(modelConfig.tableName)} (${columns
            .map(quoteIdentifier)
            .join(", ")}) VALUES (${placeholders})`,
          args: values,
        });

        return model.findById(result.lastInsertRowid);
      } catch (error) {
        if (error.message && error.message.includes("UNIQUE constraint failed")) {
          const field = (error.message.split(".").pop() || "field").replace(/["']/g, "");
          throw createHttpError(409, `${field} must be unique`);
        }

        throw error;
      }
    },

    async updateById(id, payload) {
      await ensureTable(modelConfig);
      const db = getDatabase();
      const existing = await model.findById(id);

      if (!existing) {
        return null;
      }

      const now = new Date().toISOString();
      const document = modelConfig.normalize({ ...existing, ...payload }, { existing });
      const row = mapDocumentToRow(document, modelConfig);
      const assignments = ['"data" = ?', '"updatedAt" = ?'].concat(
        Object.keys(modelConfig.columns).map((field) => `${quoteIdentifier(field)} = ?`)
      );
      const values = [
        JSON.stringify(document),
        now,
        ...Object.keys(modelConfig.columns).map((field) => row[field]),
        Number(id),
      ];

      try {
        await db.execute({
          sql: `UPDATE ${quoteIdentifier(modelConfig.tableName)} SET ${assignments.join(
            ", "
          )} WHERE "pk" = ?`,
          args: values,
        });
      } catch (error) {
        if (error.message && error.message.includes("UNIQUE constraint failed")) {
          const field = (error.message.split(".").pop() || "field").replace(/["']/g, "");
          throw createHttpError(409, `${field} must be unique`);
        }

        throw error;
      }

      return model.findById(id);
    },

    async deleteById(id) {
      await ensureTable(modelConfig);
      const db = getDatabase();
      const existing = await model.findById(id);

      if (!existing) {
        return null;
      }

      await db.execute({
        sql: `DELETE FROM ${quoteIdentifier(modelConfig.tableName)} WHERE "pk" = ?`,
        args: [Number(id)],
      });

      return existing;
    },

    async count(filters = {}) {
      await ensureTable(modelConfig);
      const db = getDatabase();
      const where = buildWhereClause(filters, modelConfig.columns);
      const result = await db.execute({
        sql: `SELECT COUNT(*) as total FROM ${quoteIdentifier(modelConfig.tableName)} ${where.sql}`,
        args: where.params,
      });

      const row = result.rows[0];
      return row?.total || 0;
    },

    async clear() {
      await ensureTable(modelConfig);
      const db = getDatabase();
      await db.execute(`DELETE FROM ${quoteIdentifier(modelConfig.tableName)}`);
    },

    async bulkCreate(items) {
      await ensureTable(modelConfig);
      const db = getDatabase();
      
      const statements = items.map(item => {
        const now = new Date().toISOString();
        const document = modelConfig.normalize(item, { isNew: true });
        const row = mapDocumentToRow(document, modelConfig);
        
        const columns = ["data", "createdAt", "updatedAt", ...Object.keys(modelConfig.columns)];
        const placeholders = columns.map(() => "?").join(", ");
        const values = [
          JSON.stringify(document),
          now,
          now,
          ...Object.keys(modelConfig.columns).map((field) => row[field]),
        ];
        
        return {
          sql: `INSERT INTO ${quoteIdentifier(modelConfig.tableName)} (${columns.map(quoteIdentifier).join(", ")}) VALUES (${placeholders})`,
          args: values
        };
      });

      try {
        await db.batch(statements, "write");
      } catch (error) {
        if (error.message && error.message.includes("UNIQUE constraint failed")) {
          const field = (error.message.split(".").pop() || "field").replace(/["']/g, "");
          throw createHttpError(409, `${field} must be unique`);
        }
        throw error;
      }
    },

    async upsertByField(field, value, payload) {
      if (!(field in modelConfig.columns)) {
        throw createHttpError(500, `Field ${field} is not configured for ${modelConfig.tableName}`);
      }

      const existing = await model.findOne({ [field]: value });

      if (existing) {
        return model.updateById(existing._id, payload);
      }

      return model.create(payload);
    },
  };

  return model;
}

module.exports = createSqliteModel;
