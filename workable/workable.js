const fetchWorkableFromAPI = require("./fetchWorkableData");


//find the name of the business
async function getCompanyName(url) {
  console.log("URL provided", url);
  
  // identify job board name from url input
  url = url.replace(/\/+$/, '');
  const parts = url.split('/');
  const companyName = parts[parts.length - 1];

  return companyName;
}

//get the job listings from the API
async function getWorkableData(companyName) {
  //get data using api
  const jobData = await fetchWorkableFromAPI(companyName);
  
  return jobData;
}

module.exports = { getCompanyName, getWorkableData };

