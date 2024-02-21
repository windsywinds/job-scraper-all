const puppeteer = require("puppeteer");

//scraper imports
const { getWorkableCompanyName, getWorkableData } = require("./workable/workable");
const getLeverJobsData = require("./lever/lever.js");
const getMyRecruitmentJobData = require("./myrecruitmentplus/myrecruitmentplus.js");
const getGreenHouseData = require("./greenhouse/greenhouse.js")

//shared components
const insertDataToDatabase = require("./components/insertToDatabase.js");

//for DOM scrapers to use puppeter
async function initBrowser() {
  console.log("Initializing browser");
  return await puppeteer.launch();
}

async function main(urls) {
  console.log(`Passed in urls: ${urls}`);

  const taskIndex = process.env.CLOUD_RUN_TASK_INDEX || 0;
  const url = urls[taskIndex];
  if (!url) {
    throw new Error(
      `No url found for task ${taskIndex}. Ensure at least ${
        parseInt(taskIndex, 10) + 1
      } url(s) have been specified as command args.`,
    );
  }

  console.log("Data retrieval started");
  let companyName = "";
  let jobData = [];
  try {
    if (url.includes("workable.com")) {
      companyName = await getWorkableCompanyName(url);
      if (companyName) {
        jobData = await getWorkableData(companyName);
      }

    } else if (url.includes("jobs.lever.co")) {
      // handle lever job fetch
      const browser = await initBrowser();
      let leverJobData = await getLeverJobsData(browser, url).catch(async (err) => {
        // Close the browser if we hit an error.
        await browser.close();
        throw err;
      });
      companyName = leverJobData.companyName
      jobData = leverJobData.updatedJobs
      await browser.close();
    } else if (url.includes("greenhouse.io")) {
      // handle greenhouse job fetch
      const browser = await initBrowser();
      let greenhouseJobData = await getGreenHouseData(browser, url).catch(
        async (err) => {
          // Close the browser if we hit an error.
          await browser.close();
          throw err;
        });
        companyName = greenhouseJobData.companyName
        jobData = greenhouseJobData.jobData
        await browser.close();
    } else if (url.includes("myrecruitmentplus")) {
        const browser = await initBrowser();
        myRecruitmentJobData = await getMyRecruitmentJobData(browser, url).catch(async (err) => {
        // Close the browser if we hit an error.
        await browser.close();
        throw err;
      });
      companyName = myRecruitmentJobData.companyName;
      jobData = myRecruitmentJobData.jobData;
      await browser.close();
    } else {
      // handle other types of URLs or throw an error if needed
      throw new Error("Unsupported job board");
    }

    console.log("Data retrieval complete");

    // Set companyName to an empty string if not provided
    let inputCompanyName = companyName || "";
    // Set jobData to the provided value or an empty array if not provided
    let inputJobData = Array.isArray(jobData) ? jobData : [];

    // Check that the companyName value has been filled
    if (inputCompanyName && inputJobData.length > 0) {

      //We should add a structure validation here as well as checking for duplicate or updated jobs? 
      //e.g
      //const checkValidJobStructure = await validationCheck(inputJobData)
      const checkValidJobStructure = true
      if (checkValidJobStructure) {
        // Insert to MongoDB collection
        await insertDataToDatabase(inputJobData);
      }
    } else {
      console.error(
        "Invalid job data: companyName or jobData is missing or empty.",
      );
    }
  } catch (err) {
    console.error("Error fetching or saving data:", err);
  }
  //confirm completion
  console.log("Job complete!");
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});
