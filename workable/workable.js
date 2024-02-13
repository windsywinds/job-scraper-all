const fetchWorkableFromAPI = require("./fetchWorkableData");


//find the name of the business
async function getWorkableCompanyName(url) {
  console.log("Extracting company name from url:", url);
  
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

module.exports = { getWorkableCompanyName, getWorkableData };

