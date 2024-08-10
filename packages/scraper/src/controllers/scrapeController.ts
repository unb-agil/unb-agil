import puppeteerSetup from '@/config/puppeteer';
import CurriculumScraper from '@/scrapers/curriculumScraper';
import DepartmentScraper from '@/scrapers/departmentScraper';
import ProgramScraper from '@/scrapers/programScraper';

const FGA_DEPARTMENT_ID = 673;
const ESW_PROGRAM_ID = 414924;

class ScrapeController {
  async scrapeAll(): Promise<void> {
    const scrapers = [
      new DepartmentScraper({ departmentIds: [FGA_DEPARTMENT_ID] }),
      new ProgramScraper({ programIds: [ESW_PROGRAM_ID] }),
      new CurriculumScraper({ programIds: [ESW_PROGRAM_ID] }),
    ];

    for (const scraper of scrapers) {
      await scraper.scrape();
    }

    await puppeteerSetup.closeBrowser();
  }
}

export default ScrapeController;
