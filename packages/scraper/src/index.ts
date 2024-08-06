import ScrapeController from '@/controllers/scrapeController';

const scrapeController = new ScrapeController();

(async () => {
  // Scrape all domains
  await scrapeController.scrapeAll();

  // Uncomment to scrape individual domains
  // await scrapeController.scrapeDepartment();
  // await scrapeController.scrapeProgram();
  // await scrapeController.scrapeCurriculum([414924]); // Engenharia de Software
  // Add other individual scrape methods as needed
})();
