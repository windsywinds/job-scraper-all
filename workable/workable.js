const fetchWorkableFromAPI = require("./fetchWorkableData");

//find the name of the business
async function getWorkableCompanyName(url) {
  console.log("Extracting company name from url:", url);

  // identify job board name from url input
  url = url.replace(/\/+$/, "");
  const parts = url.split("/");
  const companyName = parts[parts.length - 1];

  return companyName;
}

//get the job listings from the API
async function getWorkableData(companyName) {
  //get data using api
  const workableJobData = await fetchWorkableFromAPI(companyName);
  const applyLink = "https://apply.workable.com/";

  // Upload JSON data for all jobs related to the URL given
  const jobData = workableJobData.map((job, index) => ({
    createdAt: job.published,
    status: "",
    companyId: "",
    applyLink: applyLink + companyName + "/j/" + job.shortcode,
    title: job.title,
    workStyle: [job.workplace],
    workType: [job.type],
    seniority: [""],
    locations: [job.location],
    timing: [""],
    areas: [job.department],
    images: [""],
    video: {
      cover: "",
      asset: "",
      caption: "",
    },
    audio: [""],
    description: job.description,
    questions: {
      problems: "",
      traits: "",
      whyNow: "",
    },
    hiringManagerIds: [""],
  }));

  return jobData;
}

module.exports = { getWorkableCompanyName, getWorkableData };
