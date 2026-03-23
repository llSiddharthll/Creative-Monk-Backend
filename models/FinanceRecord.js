const createSqliteModel = require("./createSqliteModel");
const { asBoolean, asNumber, asString, pickEnum } = require("./shared");

module.exports = createSqliteModel({
  tableName: "finance_records",
  columns: {
    label: "TEXT",
    periodKey: "TEXT",
    currency: "TEXT",
    revenue: "REAL",
    expenses: "REAL",
    adSpend: "REAL",
    payroll: "REAL",
    toolsCost: "REAL",
    outstandingInvoices: "REAL",
    cashInHand: "REAL",
    profit: "REAL",
    marginPct: "REAL",
    status: "TEXT",
    isActive: "INTEGER",
  },
  indexFields: ["periodKey", "status", "isActive"],
  defaultSort: {
    periodKey: 1,
    createdAt: -1,
  },
  normalize(payload = {}) {
    const revenue = asNumber(payload.revenue, 0);
    const expenses = asNumber(payload.expenses, 0);
    const profit = payload.profit === undefined ? revenue - expenses : asNumber(payload.profit, 0);

    return {
      label: asString(payload.label),
      periodKey: asString(payload.periodKey),
      currency: asString(payload.currency, "INR"),
      revenue,
      expenses,
      adSpend: asNumber(payload.adSpend, 0),
      payroll: asNumber(payload.payroll, 0),
      toolsCost: asNumber(payload.toolsCost, 0),
      outstandingInvoices: asNumber(payload.outstandingInvoices, 0),
      cashInHand: asNumber(payload.cashInHand, 0),
      profit,
      marginPct:
        payload.marginPct === undefined
          ? revenue > 0
            ? Number(((profit / revenue) * 100).toFixed(2))
            : 0
          : asNumber(payload.marginPct, 0),
      status: pickEnum(payload.status, ["forecast", "actual", "closed"], "actual"),
      notes: asString(payload.notes),
      isActive: asBoolean(payload.isActive, true),
    };
  },
});
