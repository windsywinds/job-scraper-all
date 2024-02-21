const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkJob(job) {
  try {
    const filterjob = await prisma.alljobs.findFirst({
      where: {
        title: job.title,
        applyLink: job.applyLink,
      },
    });
    return filterjob;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = checkJob;
