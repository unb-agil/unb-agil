import puppeteerSetup from '@/config/puppeteer';
import DepartmentScraper from '@/scrapers/departmentScraper';
import ProgramScraper from '@/scrapers/programScraper';
import CurriculumScraper from '@/scrapers/curriculumScraper';
import CurriculumComponentScraper from '@/scrapers/curriculumComponentScraper';

const FGA_DEPARTMENT_ID = 673;
const ESW_PROGRAM_ID = 414924;
const ESW_CURRICULUM_IDS = ['6360/2', '6360/1', '6360/-2'];

class ScrapeController {
  async scrapeAll(): Promise<void> {
    const scrapers = [
      new DepartmentScraper({ departmentIds: [FGA_DEPARTMENT_ID] }),
      new ProgramScraper({ programIds: [ESW_PROGRAM_ID] }),
      new CurriculumScraper({ programIds: [ESW_PROGRAM_ID] }),
      new CurriculumComponentScraper({ curriculumIds: ESW_CURRICULUM_IDS }),
    ];

    for (const scraper of scrapers) {
      await scraper.scrape();
    }

    await puppeteerSetup.closeBrowser();
  }
}

export default ScrapeController;
