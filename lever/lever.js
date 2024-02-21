const fetchLeverPageData = require("./fetchLeverPageData");

async function getLeverCompanyName(browser, url) {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(".posting");
  
    //capture the Company Name fromm the page title
    const companyName = await page.evaluate(() => {
      return document.title;
  });

  return companyName;
}

//get the job listings 
async function getLeverJobsData(browser, url) {
  console.log(`Using Lever job board url: ${url}`);

  const companyName = await getLeverCompanyName(browser, url)
  
  const updatedJobs = await fetchLeverPageData(browser, url)

  return { companyName, updatedJobs };
}

module.exports = getLeverJobsData;
