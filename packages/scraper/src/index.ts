import ScrapeController from '@/controllers/scrapeController';

const scrapeController = new ScrapeController();

(async () => {
  // Scrape all domains
  await scrapeController.scrapeAll();

  // Uncomment to scrape individual domains
  // await scrapeController.scrapeDepartment();
  // await scrapeController.scrapeProgram();
  // Add other individual scrape methods as needed
})();
