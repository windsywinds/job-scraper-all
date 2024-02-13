const fs = require('fs');
const puppeteer = require("puppeteer");
const { Storage } = require("@google-cloud/storage");
const createStorageBucketIfMissing = require("./services/uploadToBucket")
const { getWorkableCompanyName, getWorkableData } = require("./workable/workable");
const saveFileLocally = require("./services/saveFilesLocally")
const insertDataToDatabase = require("./services/insertToDatabase")


async function main(urls) {
  console.log(`Passed in urls: ${urls}`);

  const taskIndex = process.env.CLOUD_RUN_TASK_INDEX || 0;
  const url = urls[taskIndex];
  if (!url) {
     throw new Error(
       `No url found for task ${taskIndex}. Ensure at least ${
         parseInt(taskIndex, 10) + 1
       } url(s) have been specified as command args.`
     );
   }
  // const bucketName = process.env.BUCKET_NAME;
  // if (!bucketName) {
  //   throw new Error(
  //     "No bucket name specified. Set the BUCKET_NAME env var to specify which Cloud Storage bucket the screenshot will be uploaded to."
  //   );
  // }

  console.log("Data retrieval started")
  let companyName = ''
   let jobData = [];
   try {
    if (url.includes("workable.com")) {
        companyName = await getWorkableCompanyName(url);
        if (companyName) {
            jobData = await getWorkableData(companyName);
        }
    } else if (url.includes("greenhouse.io")) {
        // handle greenhouse job fetch
        companyName = await getCompanyName(url);
        if (companyName) {
            jobData = await getWorkableData(companyName);
        }
    } else {
        // handle other types of URLs or throw an error if needed
        throw new Error('Unsupported job board');
    }

    console.log("Data retrieval complete");

    // Set companyName to an empty string if not provided
    let inputCompanyName = companyName || '';
    // Set jobData to the provided value or an empty array if not provided
    let inputJobData = Array.isArray(jobData) ? jobData : [];

    console.log("Initializing Cloud Storage client");
    const storage = new Storage();
    const bucket = await createStorageBucketIfMissing(storage, bucketName);

    //upload to bucket and return the saved filename
    // Check that the companyName value has been filled
    if (inputCompanyName && inputJobData.length < 0) {
    // Call uploadData only if companyName and jobData are valid
    const filename = await saveFileLocally(taskIndex, inputCompanyName, inputJobData);
    await insertDataToDatabase(filename)
} else {
    console.error('Invalid job data: companyName or jobData is missing or empty.');
}
} catch (err) {
console.error('Error fetching or saving data:', err);
}

  // Insert to MongoDB collection
  

  //confirm completion
  console.log("Job complete!");
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});
