const fs = require('fs');
const puppeteer = require("puppeteer");
const { Storage } = require("@google-cloud/storage");
const getWorkableData = require("./workable/workable")
const createStorageBucketIfMissing = require("./services/uploadJson")
const uploadData = require("./services/uploadJson")
// const insertDataFromFile = require("./services/insertMongo")

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
      } url(s) have been specified as command args.`
    );
  }
   const bucketName = process.env.BUCKET_NAME;
   if (!bucketName) {
     throw new Error(
       "No bucket name specified. Set the BUCKET_NAME env var to specify which Cloud Storage bucket the screenshot will be uploaded to."
     );
   }
   let companyName = ''
   let jobData = [];
   
if (url.includes("workable.com")) {
  let [fetchedCompanyName, fetchedJobData] = await getWorkableData(url).catch((err) => {
    throw err;
  });
  companyName = fetchedCompanyName
  jobData = fetchedJobData; // Assigning the job data returned from the function

} else if (url.includes("greenhouse.io")) {
  // handle greenhouse job fetch
} else {
  // handle other types of URLs or throw an error if needed
  throw new Error('Unsupported job board');
}

  console.log("Initializing Cloud Storage client");

  const storage = new Storage();
  const bucket = await createStorageBucketIfMissing(storage, bucketName);

  //upload to bucket and return the saved filename

  if (companyName) {
    console.log("SHOWING jobData on INDEX");
   
   
    
    // Call uploadData only if companyName is valid
    const filename = await uploadData(bucket, taskIndex, companyName, jobData);
} else {
    console.error('Invalid job data: companyName property is missing:', companyName);
}

  //insert to Mongo using the saved filename to find file
  //await insertDataFromFile(filename)
  console.log("Job complete!", filename);
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});
