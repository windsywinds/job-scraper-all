const { Storage } = require("@google-cloud/storage");

async function createStorageBucketIfMissing(storage, bucketName) {
    console.log(
      `Checking for Cloud Storage bucket '${bucketName}' and creating if not found`
    );
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();
    if (exists) {
      // Bucket exists, nothing to do here
      return bucket;
    }
  
    // Create bucket if needed
    const [createdBucket] = await storage.createBucket(bucketName);
    console.log(`Created Cloud Storage bucket '${createdBucket.name}'`);
    return createdBucket;
  }
  

  async function uploadData(bucket, taskIndex, companyName, jobData) {
    console.log("SHOWING jobDataon UPLOADDATA")
    console.log(jobData.jobData)
    const applyLink = 'https://apply.workable.com/';
    if (!companyName) {
        console.error('Invalid job data: companyName property is missing:', companyName);
    } else if (companyName) {
      console.log('CompanyName property found:', companyName);
    }

    
    console.log(`Uploading json file for jobs from https://apply.workable.com/${companyName} `)
    // Create filename using the current time, company name and task index
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const filename = `${date.toISOString().replace(/:/g, '_')}-${companyName}-task${taskIndex}`;
    
    // Upload JSON data for all jobs related to the URL given
    const jsonData = jobData.jobData.map((job, index) => ({
      createdAt: job.published,
      status: '',
      companyId: '',
      applyLink: applyLink + companyName + '/j/' + job.shortcode,
      title: job.title,
      workStyle: [job.workplace],
      workType: [job.type],
      seniority: [''],
      location: [job.location],
      timing: [''],
      areas: [job.department],
      images: [''],
      video: [''],
      audio: '',
      description: job.description,
      questions: {
        problems: '',
        traits: '',
        whyNow: '',
      },
      hiringManagerIds: [''],
  }));
  
    console.log(`Uploading data as '${filename}.json'`);
    await bucket.file(`${filename}.json`).save(JSON.stringify(jsonData));

    //return the filename to be used for database insertion
    //return JSON.stringify(jsonData)
    //willgCloud read the file or does it need passing raw data?
    return filename
  }

  module.exports = uploadData, createStorageBucketIfMissing;