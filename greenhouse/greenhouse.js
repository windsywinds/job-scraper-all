const scrapeGreenHouseData = require('./fetchGreenhouseData')

async function getGreenhouseCompanyName(browser, url) {
  const page = await browser.newPage();
  await page.goto(url);
  

  //capture the Company Name fromm the page title
  const companyName = await page.$eval(
    'meta[property="og:title"]',
    (element) => element.content
  );

return companyName;
}

async function getGreenHouseData(browser, url) {
  
  //select the type of job board to scrape
  if (url.includes("boards.greenhouse.io")) {
    const companyName = await getGreenhouseCompanyName(browser, url)
    const jobData = await scrapeGreenHouseData(browser, url)
    return {companyName, jobData}
  } else if (url.includes("specific case")) {
    //access the API directly to scrape data
    throw new Error('This is currently an unsupported job board');
  }

}

module.exports = getGreenHouseData;
