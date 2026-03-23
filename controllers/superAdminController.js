const asyncHandler = require("../utils/asyncHandler");
const AgencyClient = require("../models/AgencyClient");
const BlogPost = require("../models/BlogPost");
const CareerOpening = require("../models/CareerOpening");
const CaseStudy = require("../models/CaseStudy");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const Enquiry = require("../models/Enquiry");
const FinanceRecord = require("../models/FinanceRecord");
const Service = require("../models/Service");
const Testimonial = require("../models/Testimonial");

function average(values) {
  if (!values.length) {
    return 0;
  }

  return Number(
    (values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length).toFixed(1),
  );
}

function getLastNDates(days) {
  const dates = [];
  const today = new Date();

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    dates.push(date);
  }

  return dates;
}

function formatShortDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function daysUntil(dateString) {
  const target = new Date(dateString);
  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const now = new Date();
  const utcTarget = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((utcTarget - utcNow) / (1000 * 60 * 60 * 24));
}

const getSuperAdminOverview = asyncHandler(async (req, res) => {
  const [
    services,
    caseStudies,
    blogs,
    enquiries,
    newEnquiries,
    clients,
    testimonials,
    careers,
    financeRecords,
    employees,
    agencyClients,
    recentEnquiries,
    allEnquiries,
    newStatusTotal,
    inProgressStatusTotal,
    respondedStatusTotal,
    archivedStatusTotal,
    recentBlogs,
  ] = await Promise.all([
    Service.count({ isActive: true }),
    CaseStudy.count({ isActive: true }),
    BlogPost.count({ isPublished: true }),
    Enquiry.count(),
    Enquiry.count({ status: "new" }),
    Client.count({ status: "active" }),
    Testimonial.count({ isActive: true }),
    CareerOpening.count({ isActive: true }),
    FinanceRecord.findAll({
      filters: { isActive: 1 },
      sort: { periodKey: 1, createdAt: -1 },
    }),
    Employee.findAll({
      filters: { isActive: 1 },
      sort: { order: 1, createdAt: -1 },
    }),
    AgencyClient.findAll({
      filters: { isActive: 1 },
      sort: { order: 1, createdAt: -1 },
    }),
    Enquiry.findAll({
      sort: { createdAt: -1 },
      limit: 5,
    }),
    Enquiry.findAll({
      sort: { createdAt: -1 },
    }),
    Enquiry.count({ status: "new" }),
    Enquiry.count({ status: "in-progress" }),
    Enquiry.count({ status: "responded" }),
    Enquiry.count({ status: "archived" }),
    BlogPost.findAll({
      filters: { isPublished: true },
      sort: { publishedAt: -1, createdAt: -1 },
      limit: 4,
    }),
  ]);

  const financeSummary = financeRecords.reduce(
    (totals, item) => {
      totals.revenue += Number(item.revenue || 0);
      totals.expenses += Number(item.expenses || 0);
      totals.profit += Number(item.profit || 0);
      totals.outstandingInvoices += Number(item.outstandingInvoices || 0);
      return totals;
    },
    { revenue: 0, expenses: 0, profit: 0, outstandingInvoices: 0 },
  );

  const activeEmployees = employees.filter((employee) => employee.status !== "inactive");
  const liveClients = agencyClients.filter((client) => client.status !== "offboarded");
  const enquiryStatusCounts = [
    { status: "new", total: newStatusTotal },
    { status: "in-progress", total: inProgressStatusTotal },
    { status: "responded", total: respondedStatusTotal },
    { status: "archived", total: archivedStatusTotal },
  ];
  const dailyEnquiries = getLastNDates(7).map((date) => {
    const key = date.toISOString().slice(0, 10);
    const total = allEnquiries.filter((enquiry) => {
      const createdAt = new Date(enquiry.createdAt || "");
      return !Number.isNaN(createdAt.getTime()) && createdAt.toISOString().slice(0, 10) === key;
    }).length;

    return {
      key,
      label: formatShortDate(date),
      total,
    };
  });
  const clientsNeedingAttention = liveClients
    .map((client) => ({
      ...client,
      reviewDueInDays: daysUntil(client.nextReviewDate),
    }))
    .sort((a, b) => {
      const healthPriority = { red: 0, amber: 1, green: 2 };
      const leftHealth = healthPriority[a.projectHealth] ?? 3;
      const rightHealth = healthPriority[b.projectHealth] ?? 3;

      if (leftHealth !== rightHealth) {
        return leftHealth - rightHealth;
      }

      return (a.reviewDueInDays ?? 999) - (b.reviewDueInDays ?? 999);
    });
  const reviewQueue = clientsNeedingAttention
    .filter((client) => client.reviewDueInDays !== null)
    .slice(0, 6)
    .map((client) => ({
      _id: client._id,
      name: client.name,
      owner: client.owner,
      projectHealth: client.projectHealth,
      reviewDueInDays: client.reviewDueInDays,
      nextReviewDate: client.nextReviewDate,
    }));
  const actionItems = [
    financeSummary.outstandingInvoices > 0
      ? {
          title: "Follow up on outstanding invoices",
          detail: `${Number(financeSummary.outstandingInvoices.toFixed(0))} INR is still pending collection.`,
          href: "/admin/super/finance",
          priority: "high",
        }
      : null,
    clientsNeedingAttention.find((client) => client.projectHealth === "red")
      ? {
          title: "Review at-risk client accounts",
          detail: `${clientsNeedingAttention.filter((client) => client.projectHealth === "red").length} client accounts are in red health.`,
          href: "/admin/super/clients",
          priority: "high",
        }
      : null,
    activeEmployees.find((employee) => Number(employee.utilizationPct || 0) >= 85)
      ? {
          title: "Balance delivery capacity",
          detail: `${activeEmployees.filter((employee) => Number(employee.utilizationPct || 0) >= 85).length} team members are operating above 85% utilization.`,
          href: "/admin/super/employees",
          priority: "medium",
        }
      : null,
    reviewQueue.find((client) => (client.reviewDueInDays ?? 99) <= 7)
      ? {
          title: "Prepare upcoming client review calls",
          detail: `${reviewQueue.filter((client) => (client.reviewDueInDays ?? 99) <= 7).length} client reviews are due in the next 7 days.`,
          href: "/admin/super/clients",
          priority: "medium",
        }
      : null,
    recentBlogs.length < 3
      ? {
          title: "Push content output this month",
          detail: "Published blog volume is low. Add new pieces or case studies to strengthen the authority layer.",
          href: "/admin/dashboard/blogs",
          priority: "medium",
        }
      : {
          title: "Approve the next content sprint",
          detail: `${recentBlogs.length} recent blog entries are live. Review what should be repurposed into case studies or social assets.`,
          href: "/admin/dashboard/blogs",
          priority: "low",
        },
  ].filter(Boolean);
  const activityFeed = [
    ...recentEnquiries.map((enquiry) => ({
      type: "enquiry",
      title: `${enquiry.name} submitted a new enquiry`,
      meta: `${enquiry.service || "General enquiry"} • ${enquiry.status}`,
      date: enquiry.createdAt,
    })),
    ...recentBlogs.map((blog) => ({
      type: "content",
      title: `Blog published: ${blog.title}`,
      meta: `${blog.category} • ${blog.author || "Creative Monk Team"}`,
      date: blog.publishedAt || blog.createdAt,
    })),
    ...financeRecords.slice(-2).map((record) => ({
      type: "finance",
      title: `Finance period updated: ${record.label || record.periodKey}`,
      meta: `Profit ${Number(record.profit || 0).toFixed(0)} ${record.currency || "INR"}`,
      date: record.updatedAt || record.createdAt,
    })),
  ]
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  const sourceBreakdown = Array.from(
    allEnquiries.reduce((map, enquiry) => {
      const key = enquiry.sourcePage || "direct";
      map.set(key, (map.get(key) || 0) + 1);
      return map;
    }, new Map()),
  )
    .map(([source, total]) => ({ source, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);
  const alertsSnapshot = [
    {
      id: "collections",
      label: "Collections pending",
      total: financeSummary.outstandingInvoices > 0 ? 1 : 0,
      value: Number(financeSummary.outstandingInvoices.toFixed(0)),
      tone: financeSummary.outstandingInvoices > 0 ? "high" : "low",
      href: "/admin/super/finance",
    },
    {
      id: "client-risk",
      label: "Client risk alerts",
      total: clientsNeedingAttention.filter((client) => client.projectHealth === "red").length,
      value: clientsNeedingAttention.filter((client) => client.projectHealth === "red").length,
      tone: clientsNeedingAttention.some((client) => client.projectHealth === "red") ? "high" : "low",
      href: "/admin/super/clients",
    },
    {
      id: "reviews",
      label: "Reviews due soon",
      total: reviewQueue.filter((client) => (client.reviewDueInDays ?? 99) <= 7).length,
      value: reviewQueue.filter((client) => (client.reviewDueInDays ?? 99) <= 7).length,
      tone: reviewQueue.some((client) => (client.reviewDueInDays ?? 99) <= 7) ? "medium" : "low",
      href: "/admin/super/clients",
    },
    {
      id: "capacity",
      label: "Overloaded team",
      total: activeEmployees.filter((employee) => Number(employee.utilizationPct || 0) >= 85).length,
      value: activeEmployees.filter((employee) => Number(employee.utilizationPct || 0) >= 85).length,
      tone: activeEmployees.some((employee) => Number(employee.utilizationPct || 0) >= 85) ? "medium" : "low",
      href: "/admin/super/employees",
    },
  ];

  res.json({
    overview: {
      services,
      caseStudies,
      blogs,
      enquiries,
      newEnquiries,
      clients,
      testimonials,
      careers,
      trackedRevenue: Number(financeSummary.revenue.toFixed(2)),
      trackedExpenses: Number(financeSummary.expenses.toFixed(2)),
      trackedProfit: Number(financeSummary.profit.toFixed(2)),
      outstandingInvoices: Number(financeSummary.outstandingInvoices.toFixed(2)),
      avgTeamUtilization: average(activeEmployees.map((employee) => employee.utilizationPct || 0)),
      totalPayroll: Number(
        activeEmployees.reduce(
          (sum, employee) => sum + Number(employee.monthlySalary || 0),
          0,
        ).toFixed(2),
      ),
      totalRetainers: Number(
        liveClients.reduce(
          (sum, client) => sum + Number(client.monthlyRetainer || 0),
          0,
        ).toFixed(2),
      ),
      liveWebsites: liveClients.filter((client) => client.website).length,
      managedWebsites: liveClients.reduce(
        (sum, client) => sum + (Array.isArray(client.websitesManaged) ? client.websitesManaged.length : 0),
        0,
      ),
      activeServiceLines: liveClients.reduce(
        (sum, client) => sum + (Array.isArray(client.services) ? client.services.length : 0),
        0,
      ),
    },
    financeTrend: financeRecords.map((item) => ({
      label: item.label || item.periodKey || item.createdAt?.slice(0, 7),
      periodKey: item.periodKey,
      revenue: Number(item.revenue || 0),
      expenses: Number(item.expenses || 0),
      adSpend: Number(item.adSpend || 0),
      payroll: Number(item.payroll || 0),
      toolsCost: Number(item.toolsCost || 0),
      profit: Number(item.profit || 0),
      marginPct: Number(item.marginPct || 0),
      cashInHand: Number(item.cashInHand || 0),
      outstandingInvoices: Number(item.outstandingInvoices || 0),
      status: item.status,
    })),
    dailyEnquiries,
    teamSnapshot: activeEmployees.map((employee) => ({
      _id: employee._id,
      name: employee.name,
      role: employee.role,
      department: employee.department,
      status: employee.status,
      ownerLevel: employee.ownerLevel,
      utilizationPct: Number(employee.utilizationPct || 0),
      monthlySalary: Number(employee.monthlySalary || 0),
      assignedClients: employee.assignedClients || [],
    })),
    clientSnapshot: liveClients.map((client) => ({
      _id: client._id,
      name: client.name,
      website: client.website,
      owner: client.owner,
      status: client.status,
      projectHealth: client.projectHealth,
      monthlyRetainer: Number(client.monthlyRetainer || 0),
      seoScore: Number(client.seoScore || 0),
      socialScore: Number(client.socialScore || 0),
      websiteScore: Number(client.websiteScore || 0),
      nextReviewDate: client.nextReviewDate,
      services: client.services || [],
      websitesManaged: client.websitesManaged || [],
      priorityGoals: client.priorityGoals || [],
      hasCmsAccess: Boolean(client.hasCmsAccess),
    })),
    clientRetainers: liveClients
      .map((client) => ({
        _id: client._id,
        name: client.name,
        monthlyRetainer: Number(client.monthlyRetainer || 0),
        owner: client.owner,
        projectHealth: client.projectHealth,
      }))
      .sort((a, b) => b.monthlyRetainer - a.monthlyRetainer),
    enquiryPipeline: enquiryStatusCounts,
    recentEnquiries: recentEnquiries.map((enquiry) => ({
      _id: enquiry._id,
      name: enquiry.name,
      service: enquiry.service,
      status: enquiry.status,
      sourcePage: enquiry.sourcePage,
      createdAt: enquiry.createdAt,
    })),
    reviewQueue,
    actionItems,
    activityFeed,
    sourceBreakdown,
    alertsSnapshot,
    contentSnapshot: {
      totalPublishedBlogs: blogs,
      featuredBlogs: recentBlogs.filter((blog) => blog.featured).length,
      latestTitles: recentBlogs.map((blog) => ({
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
      })),
    },
  });
});

module.exports = {
  getSuperAdminOverview,
};
