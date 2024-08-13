import ScrapeController from '@/controllers/scrapeController';

const FGA_DEPARTMENT_ID = 673;
const scrapeController = new ScrapeController();

(async () => {
  await scrapeController.scrape({
    departmentIds: [FGA_DEPARTMENT_ID],
  });
})();
