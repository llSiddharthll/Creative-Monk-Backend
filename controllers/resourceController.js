const asyncHandler = require("../utils/asyncHandler");

function buildSort(defaultSort) {
  return defaultSort || { order: 1, createdAt: -1 };
}

function createResourceController({
  Model,
  publicFilter = { isActive: true },
  defaultSort,
  lookupField = "_id",
  listTransform,
}) {
  const modelFields = Model.fields || {};

  const applyQuery = (req, query, isPublic) => {
    if (!isPublic && typeof req.query.status === "string" && "status" in modelFields) {
      query.status = req.query.status;
    }

    if (typeof req.query.page === "string" && "page" in modelFields) {
      query.page = req.query.page;
    }

    if (typeof req.query.category === "string" && "category" in modelFields) {
      query.category = req.query.category;
    }

    if (typeof req.query.featured === "string") {
      const enabled = req.query.featured === "true";
      if ("featured" in modelFields) query.featured = enabled;
      if ("isFeatured" in modelFields) query.isFeatured = enabled;
    }

    if (typeof req.query.published === "string" && "isPublished" in modelFields) {
      query.isPublished = req.query.published === "true";
    }

    if (typeof req.query.active === "string" && "isActive" in modelFields) {
      query.isActive = req.query.active === "true";
    }

    return query;
  };

  const list = asyncHandler(async (req, res) => {
    const filters = applyQuery(req, { ...publicFilter }, true);
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const documents = await Model.findAll({
      filters,
      sort: buildSort(defaultSort),
      limit,
    });

    res.json(listTransform ? listTransform(documents) : documents);
  });

  const adminList = asyncHandler(async (req, res) => {
    const filters = applyQuery(req, {}, false);
    const documents = await Model.findAll({
      filters,
      sort: buildSort(defaultSort),
    });
    res.json(documents);
  });

  const getOne = asyncHandler(async (req, res) => {
    const lookupValue = req.params.id || req.params.slug;
    const query = lookupField === "_id" ? { ...publicFilter } : { [lookupField]: lookupValue, ...publicFilter };
    const document =
      lookupField === "_id"
        ? await Model.findById(lookupValue)
        : await Model.findOne(query, { sort: buildSort(defaultSort) });

    if (!document || Object.entries(publicFilter || {}).some(([key, value]) => document[key] !== value)) {
      return res.status(404).json({ error: "Resource not found" });
    }

    return res.json(document);
  });

  const create = asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json(document);
  });

  const update = asyncHandler(async (req, res) => {
    const document = await Model.updateById(req.params.id, req.body);

    if (!document) {
      return res.status(404).json({ error: "Resource not found" });
    }

    return res.json(document);
  });

  const remove = asyncHandler(async (req, res) => {
    const document = await Model.deleteById(req.params.id);

    if (!document) {
      return res.status(404).json({ error: "Resource not found" });
    }

    return res.json({ success: true });
  });

  return {
    list,
    adminList,
    getOne,
    create,
    update,
    remove,
  };
}

module.exports = createResourceController;
