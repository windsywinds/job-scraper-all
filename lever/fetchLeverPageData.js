

async function addDescription(jobs, browser) {
    console.log("Adding description");
    for (const job of jobs) {
    console.log(`Merging job ${jobs.indexOf(job) + 1} of ${jobs.length}`);
      const jobLandingPage = await browser.newPage();
      await jobLandingPage.goto(job.applyLink);
      await jobLandingPage.waitForSelector('meta[property="og:description"]');
      job.description = await jobLandingPage.$eval(
        'meta[property="og:description"]', // Selector for the meta tag containing the description
        (element) => (element ? element.getAttribute("content") : "")
      );
      await jobLandingPage.close();
    }
    return jobs;
  }
  
  //get the job listings from the API
  async function fetchLeverPageData(browser, url) {
    const page = await browser.newPage();
  
   
    await page.goto(url);
  
    await page.waitForSelector(".posting");
  
    const jobs = await page.$$eval(
      ".postings-group .posting",
      (postings) =>
        postings.map((posting) => {
          const areasElement = posting
            .closest(".postings-group")
            .querySelector(".large-category-label");
          const areas = areasElement ? areasElement.innerText : "";
          const workTypeElement = posting.querySelector(
            ".posting-categories .sort-by-commitment"
          );
          const workType = workTypeElement ? workTypeElement.innerText : "";
  
          const titleElement = posting.querySelector(
            ".posting-title h5[data-qa='posting-name']"
          );
          const locationElement = posting.querySelector(
            ".posting-title .posting-categories .sort-by-location"
          );
          const workStyleElement = posting.querySelector(
            ".posting-categories .workplaceTypes"
          );
          const jobURLElement = posting.querySelector(".posting .posting-title");
  
          return {
            createdAt: '',
            status: '',
            companyId: '',
            applyLink: jobURLElement ? jobURLElement.href : "",
            title: titleElement ? titleElement.innerText : "",
            workStyle: [workStyleElement ? workStyleElement.innerText : ""],
            workType: [workType],
            seniority: [''],
            locations: [locationElement ? locationElement.innerText : ""],
            timing: [''],
            areas: [areas],
            images: [''],
            video: {
              cover: "",
              asset: "",
              caption: "",
            },
            audio: [""],
            description: '',
            questions: {
                problems: '',
                traits: '',
                whyNow: '',
            },
            hiringManagerIds: [''],
          };
        })
    );
    //open job links and add the description inside the jobs list
    const updatedJobs = await addDescription(jobs, browser);
  
    return updatedJobs ;
  }
  
  module.exports = fetchLeverPageData
  
  