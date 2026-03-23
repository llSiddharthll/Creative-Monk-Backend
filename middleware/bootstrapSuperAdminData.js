const AgencyClient = require("../models/AgencyClient");
const Employee = require("../models/Employee");
const Enquiry = require("../models/Enquiry");
const FinanceRecord = require("../models/FinanceRecord");
const seedData = require("../seed/seedData");

let bootstrapPromise = null;

module.exports = async function bootstrapSuperAdminData(req, res, next) {
  try {
    const [financeCount, employeeCount, clientCount, enquiryCount] = await Promise.all([
      FinanceRecord.count(),
      Employee.count(),
      AgencyClient.count(),
      Enquiry.count(),
    ]);

    if (financeCount === 0 || employeeCount === 0 || clientCount === 0 || enquiryCount === 0) {
      if (!bootstrapPromise) {
        const jobs = [];

        if (financeCount === 0) {
          jobs.push(FinanceRecord.bulkCreate(seedData.financeRecords || []));
        }

        if (employeeCount === 0) {
          jobs.push(Employee.bulkCreate(seedData.employees || []));
        }

        if (clientCount === 0) {
          jobs.push(AgencyClient.bulkCreate(seedData.agencyClients || []));
        }

        if (enquiryCount === 0) {
          jobs.push(Enquiry.bulkCreate(seedData.enquiries || []));
        }

        bootstrapPromise = Promise.all(jobs).finally(() => {
          bootstrapPromise = null;
        });
      }

      await bootstrapPromise;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
