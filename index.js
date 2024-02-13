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

   let jobData = [];
   if (url.includes("workable.com")) {
       jobData = await getWorkableData(url).catch((err) => {
           throw err;
       });
   } else if (url.includes("greenhouse.io")) {
       // handle greenhouse job fet
   } else {
       // handle other types of URLs or throw an error if needed
       throw new Error('Unsupported job board');
   }
   const companyName = jobData.companyName
   console.log("INDEX.JS CompanyName to pass:", companyName)
 
  console.log("Initializing Cloud Storage client");

  const storage = new Storage();
  const bucket = await createStorageBucketIfMissing(storage, bucketName);

  //upload to bucket and return the saved filename

  console.log("SHOWING jobData on INDEX")
  console.log(jobData.jobData)
  const filename = await uploadData(bucket, taskIndex, companyName, jobData);

  //insert to Mongo using the saved filename to find file
  //await insertDataFromFile(filename)
  console.log("Job complete!", filename);
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});
