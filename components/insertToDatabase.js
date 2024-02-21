const checkJob = require("./checkjob");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function insertDataToDatabase(inputJobData) {
  try {
    console.log("Inserting data to database...");
    //Loop through inputJobData and create records for each item
    for (const job of inputJobData) {
      const eachjob = await checkJob(job);
      if (eachjob) {
        console.log(`Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} is already in the database`);
      } else {
        await prisma.alljobs.create({
          data: job, // Use individual job object
        });
        console.log(`Job ${inputJobData.indexOf(job) + 1} of ${inputJobData.length} has been added to the database: ${job.title}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
  }
}

module.exports = insertDataToDatabase;