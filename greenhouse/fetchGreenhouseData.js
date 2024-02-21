
async function scrapeGreenHouseData(browser, url) {
    try {
      const page = await browser.newPage();
  
      console.log("Launching Browser...");
  
      await page.goto(url); //visit the webpage coming from the input
      await page.waitForSelector(".level-0"); // Wait for the job listings to load to ensure data exists
  
  
      const tempJobs = await page.$$eval(
        ".level-0 .opening",
        (elements) =>
          elements.map((element) => {
            const joburl = element.querySelector("a").href;
            const position = element.querySelector("a").innerText;
            const location = element.querySelector(".location").innerText;
            const areas = element
              .closest(".level-0")
              .querySelector("h3").innerText;
  
            return {
              createdAt: '',
              status: '',
              companyId: '',
              applyLink: joburl,
              title: position,
              workStyle: [],
              workType: [],
              seniority: [''],
              locations: [location],
              timing: "",
              areas: [areas],
              images: "",
              video: {
                cover: "",
                asset: "",
                caption: "",
              },
              audio: [""],
              description: "",
              questions: {
                problems: "",
                traits: "",
                whyNow: "",
              },
              hiringManagerIds: "",
            };
          })
      );
  
      const finalJob = await description(tempJobs, browser);
      return finalJob;
    } catch (e) {
      console.error(e);
    }
  }
  
  async function description(jobs, browser) {
    try {
      console.log(`Adding descriptions...`);
  
      for (const job of jobs) {
        const page = await browser.newPage();
        await page.goto(job.applyLink);
        console.log(`Merging job ${jobs.indexOf(job) + 1} of ${jobs.length}`);
        await page.waitForSelector("#content");
  
        let description = "empty";
  
        //some of the page has different dom design
        const descriptionSelectors = [
          "#content .description > p:nth-child(2)",
          "#content > p:nth-child(2)",
          "#content .p-rich_text_section",
          "#content .p-rich_text_section > p:nth-child(2)",
        ];
  
        //use page.$ instead of page.$eval because eval returning an error after it didn't catch the correct pattern of selector
        //check the selector pattern, if matches then proceed
        for (const selector of descriptionSelectors) {
          const element = await page.$(selector);
          if (element) {
            const innerText = await page.evaluate((el) => el.innerText, element);
            //this is manually checked since there's one element that has html content, will use dom verifier/library afterwards
            if (innerText.length < 1000) { 
              description = innerText;
              break;
            }
          }
        }
  
        job.description = description;
  
        job.description = (await description) ? description : "empty";
        await page.close();
      }
      return jobs;
    } catch (e) {
      console.error(e);
    }
  }
  
  module.exports = scrapeGreenHouseData;