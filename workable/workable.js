const fetchWorkableFromAPI = require("./getWorkableData")

async function getWorkableData(url) {
  console.log("URL provided", url)
  
  // identify job board name from url input
  url = url.replace(/\/+$/, '');
  const parts = url.split('/');
  const companyName = parts[parts.length - 1];
  console.log(`Using company name: ${companyName}`)

  //get data using api
  const jobData = await fetchWorkableFromAPI(companyName);

  return { companyName, jobData };
}
module.exports = getWorkableData;