const fetchMyRecruitmentData = require("./fetchMyRecruitmentData");

async function getMyRecruitmentJobData(browser, url) {

  const jobData = await fetchMyRecruitmentData(browser, url);
    const companyName = "" //empty string because companyName is expected to be returned
    
  return {jobData, companyName};
}

module.exports = getMyRecruitmentJobData;

  