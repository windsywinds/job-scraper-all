//this can be replaced with uploadJson to save the json file locally for tests

const fs = require('fs');
 
  async function saveData(taskIndex, companyName, jobData) {
  const applyLink = 'https://apply.workable.com/';
    // Create filename using the current time, company name and task index
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const filename = `${date.toISOString().replace(/:/g, '_')}-${companyName}-task${taskIndex}`;
    
  
    // Upload JSON data for all jobs related to the URL given
    const jsonData = jobData.map((job, index) => ({
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
    //await bucket.file(`${filename}.json`).save(JSON.stringify(jsonData));
    
    fs.writeFile(`${filename}.json`, JSON.stringify(jsonData, null, 2), (err) => {
    if (err) throw err;
    console.log('JSON data saved to', filename);
  });

    return filename
  }

  module.exports = saveData;