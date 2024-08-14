import ScrapeController from '@/controllers/scrapeController';

// const FGA_DEPARTMENT_ID = 673;
const ESW_PROGRAM_ID = 414924;
const PROGRAM_IDS = [ESW_PROGRAM_ID];

const scrapeController = new ScrapeController();

(async () => {
  await scrapeController.scrapeByProgram(PROGRAM_IDS);
})();
