const asyncHandler = require("../utils/asyncHandler");
const FinanceRecord = require("../models/FinanceRecord");
const AgencyClient = require("../models/AgencyClient");

const getFinanceSummary = asyncHandler(async (req, res) => {
  const records = await FinanceRecord.findAll({ sort: { periodKey: 1 } });
  const totals = records.reduce((acc, r) => {
    acc.revenue += Number(r.revenue || 0);
    acc.expenses += Number(r.expenses || 0);
    acc.profit += Number(r.profit || 0);
    acc.adSpend += Number(r.adSpend || 0);
    acc.payroll += Number(r.payroll || 0);
    acc.toolsCost += Number(r.toolsCost || 0);
    acc.outstandingInvoices += Number(r.outstandingInvoices || 0);
    acc.cashInHand += Number(r.cashInHand || 0);
    return acc;
  }, { revenue: 0, expenses: 0, profit: 0, adSpend: 0, payroll: 0, toolsCost: 0, outstandingInvoices: 0, cashInHand: 0 });

  totals.marginPct = totals.revenue > 0 ? ((totals.profit / totals.revenue) * 100) : 0;
  totals.records = records;

  res.json(totals);
});

const getExpenseBreakdown = asyncHandler(async (req, res) => {
  const records = await FinanceRecord.findAll({ sort: { periodKey: 1 } });
  const breakdown = records.reduce((acc, r) => {
    acc.payroll += Number(r.payroll || 0);
    acc.adSpend += Number(r.adSpend || 0);
    acc.toolsCost += Number(r.toolsCost || 0);
    const other = Number(r.expenses || 0) - Number(r.payroll || 0) - Number(r.adSpend || 0) - Number(r.toolsCost || 0);
    acc.other += Math.max(other, 0);
    return acc;
  }, { payroll: 0, adSpend: 0, toolsCost: 0, other: 0 });

  res.json(breakdown);
});

const getClientBreakdown = asyncHandler(async (req, res) => {
  const clients = await AgencyClient.findAll({ filters: { isActive: true }, sort: { monthlyRetainer: -1 } });
  const breakdown = clients.map((c) => ({
    _id: c._id,
    name: c.name,
    monthlyRetainer: Number(c.monthlyRetainer || 0),
    projectHealth: c.projectHealth,
    status: c.status,
  }));
  res.json(breakdown);
});

const getPnl = asyncHandler(async (req, res) => {
  const records = await FinanceRecord.findAll({ sort: { periodKey: 1 } });
  const pnl = records.map((r) => ({
    label: r.label,
    periodKey: r.periodKey,
    revenue: Number(r.revenue || 0),
    expenses: Number(r.expenses || 0),
    payroll: Number(r.payroll || 0),
    adSpend: Number(r.adSpend || 0),
    toolsCost: Number(r.toolsCost || 0),
    otherExpenses: Math.max(Number(r.expenses || 0) - Number(r.payroll || 0) - Number(r.adSpend || 0) - Number(r.toolsCost || 0), 0),
    profit: Number(r.profit || 0),
    marginPct: Number(r.marginPct || 0),
    status: r.status,
  }));
  res.json(pnl);
});

module.exports = { getFinanceSummary, getExpenseBreakdown, getClientBreakdown, getPnl };
