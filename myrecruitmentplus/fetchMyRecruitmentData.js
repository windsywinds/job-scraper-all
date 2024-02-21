async function fetchMyRecruitmentData(browser, url) {
    const page = await browser.newPage();
  
    console.log(`Navigating to ${url}`);
    await page.goto(url);
  
    // Wait for the job listings to load
    await page.waitForSelector(`[class="adlogic_job_results"]`);
    const jobs = await page.$$eval(`[class="position"]`, async (elements) => {
      console.log("Number of elements found:", elements.length);
      const jobsData = [];
  
      for (const e of elements) { 
        // MyRecruitMentPlus has an empty entry at the end of their page which is likely used for adding a new job
        // this if statement will filter it out from the collected data
        if (e.querySelector('h2 a').getAttribute('href') !== '{job_link}') {
            const locationElements = e.querySelectorAll('.ajb_location li');
            const locationArray = Array.from(locationElements).map(li => li.innerText);
            const jobData = {
                createdAt: e.querySelector('div[class="date"]').innerText,
                status: "",
                companyId: "",
                applyLink: e.querySelector('h2 a').getAttribute('href'),
                title: e.querySelector('h2').innerText,
                workStyle: [''],
                workType: [''],
                seniority: [""],
                location: locationArray,
                timing: [""],
                areas: [e.querySelector('[class="ajb_classification"]').innerText],
                images: [""],
                video: {
                  cover: "",
                  asset: "",
                  caption: "",
                },
                audio: "",
                description: "",
                questions: {
                  problems: "",
                  traits: "",
                  whyNow: "",
                },
                hiringManagerIds: [""],
              }
  
            jobsData.push(jobData);
        }
      }
  
      return jobsData;
    });
  
    // Visit each job posting page to extract the description and workType
    for (const job of jobs) {
      const jobPage = await browser.newPage();
      await jobPage.goto(job.applyLink);
      console.log("Navigating to job page", jobs.indexOf(job) + 1, "of", jobs.length, ":", job.applyLink);
      //add to the job entry data
      try {
        await jobPage.waitForSelector('[id="jobTemplateTitleId"]', {
          timeout: 5000,
        }); 
        job.description = await jobPage.$eval('[id="jobTemplateBodyContainerId"]',
          (element) => element.innerText
        );
        job.workType = await jobPage.$eval('#adlogic_job_details_job_info :nth-child(3)',
        (element) => element.innerText
      );
      } catch (error) {
        console.error(
          `Error extracting description for job ${job.title}:`,
          error.message
        );
      }
  
      await jobPage.close();
    }
  
    return jobs ;
  }

  module.exports = fetchMyRecruitmentData;

  