const fs = require('fs');
const puppeteer = require("puppeteer");
const { Storage } = require("@google-cloud/storage");
const createStorageBucketIfMissing = require("./services/uploadJson")

const saveData = require("./services/saveLocal")
const insertDataFromFile = require("./services/insertMongo")
const getWorkableData = require('./workable/workable');

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
  let jobData = [];
   if (url.includes("workable")) {
       jobData = await getWorkableData(url).catch((err) => {
           throw err;
       });
   } else if (url.includes("greenhouse")) {
       // handle greenhouse job fetch
       jobData = await getGreenhouseData(url).catch((err) => {
           throw err;
       });
   } else {
       // handle other types of URLs or throw an error if needed
       throw new Error('Unsupported job board');
   }
   
  console.log("Data retrieval complete")
  
 

  //console.log("Initializing Cloud Storage client");
  //const storage = new Storage();
  //const bucket = await createStorageBucketIfMissing(storage, bucketName);
  //upload to bucket and return the saved jsonData
  //const jsonData = await uploadData(bucket, taskIndex, jobData);


  //upload to cloud bucket and return the formatted data to be used in DB
  console.log("Data saving in progress...")
  const filename = await saveData(taskIndex, jobData);
  console.log("Data save complete") 

  // Insert to MongoDB collection
  console.log("Data upload to database started...")
  await insertDataFromFile(filename)
  console.log("Data upload complete")

  //confirm completion
  console.log("Job complete!");
}

main(process.argv.slice(2)).catch((err) => {
  console.error(JSON.stringify({ severity: "ERROR", message: err.message }));
  process.exit(1);
});
