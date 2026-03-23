const asyncHandler = require("../utils/asyncHandler");
const Employee = require("../models/Employee");

const getEmployeeSummary = asyncHandler(async (req, res) => {
  const employees = await Employee.findAll({});
  const active = employees.filter((e) => e.status !== "inactive");
  const totalPayroll = active.reduce((sum, e) => sum + Number(e.monthlySalary || 0), 0);
  const avgUtilization = active.length > 0
    ? active.reduce((sum, e) => sum + Number(e.utilizationPct || 0), 0) / active.length
    : 0;

  const departments = {};
  active.forEach((e) => {
    const dept = e.department || "Other";
    departments[dept] = (departments[dept] || 0) + 1;
  });

  res.json({
    totalActive: active.length,
    totalPayroll,
    avgUtilization: Math.round(avgUtilization * 10) / 10,
    departments: Object.entries(departments).map(([name, count]) => ({ name, count })),
    overloaded: active.filter((e) => Number(e.utilizationPct || 0) >= 85).length,
  });
});

const getUtilization = asyncHandler(async (req, res) => {
  const employees = await Employee.findAll({});
  const active = employees.filter((e) => e.status !== "inactive");
  const utilization = active
    .map((e) => ({
      _id: e._id,
      name: e.name,
      role: e.role,
      department: e.department,
      utilizationPct: Number(e.utilizationPct || 0),
      monthlySalary: Number(e.monthlySalary || 0),
      assignedClients: e.assignedClients || [],
      status: e.status,
    }))
    .sort((a, b) => b.utilizationPct - a.utilizationPct);
  res.json(utilization);
});

const getDepartmentStats = asyncHandler(async (req, res) => {
  const employees = await Employee.findAll({});
  const active = employees.filter((e) => e.status !== "inactive");
  const stats = {};
  active.forEach((e) => {
    const dept = e.department || "Other";
    if (!stats[dept]) stats[dept] = { name: dept, count: 0, totalSalary: 0, avgUtilization: 0 };
    stats[dept].count += 1;
    stats[dept].totalSalary += Number(e.monthlySalary || 0);
    stats[dept].avgUtilization += Number(e.utilizationPct || 0);
  });
  Object.values(stats).forEach((s) => {
    s.avgUtilization = s.count > 0 ? Math.round((s.avgUtilization / s.count) * 10) / 10 : 0;
  });
  res.json(Object.values(stats));
});

module.exports = { getEmployeeSummary, getUtilization, getDepartmentStats };
