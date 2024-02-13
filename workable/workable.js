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
  console.log(`Data being returned on workable.js to index.js: ${jobData.data}}`)

  return { companyName, jobData };
}
module.exports = getWorkableData;