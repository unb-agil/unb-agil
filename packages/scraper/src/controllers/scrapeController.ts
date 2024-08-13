import puppeteerSetup from '@/config/puppeteer';
import DepartmentScraper from '@/scrapers/departmentScraper';
import ProgramScraper from '@/scrapers/programScraper';
import CurriculumScraper from '@/scrapers/curriculumScraper';
import CurriculumComponentScraper from '@/scrapers/curriculumComponentScraper';
import ComponentScraper from '@/scrapers/componentScraper';
import { ScrapeControllerOptions } from '@/models/scraperControllerModels';

const ESW_PROGRAM_ID = 414924;
const ESW_CURRICULUM_IDS = ['6360/2', '6360/1', '6360/-2'];
const ESW_COMPONENT_IDS = ['FGA0266', 'FGA0038', 'FGA0035'];

class ScrapeController {
  async scrape(options?: ScrapeControllerOptions): Promise<void> {
    const { departmentIds } = options || {};

    const scrapers = [
      new DepartmentScraper({ departmentIds }),
      // new ProgramScraper({ programIds: [ESW_PROGRAM_ID] }),
      // new CurriculumScraper({ programIds: [ESW_PROGRAM_ID] }),
      // new CurriculumComponentScraper({ curriculumIds: ESW_CURRICULUM_IDS }),
      // new ComponentScraper({ componentIds: ESW_COMPONENT_IDS }),
    ];

    for (const scraper of scrapers) {
      await scraper.scrape();
    }

    await puppeteerSetup.closeBrowser();
  }
}

export default ScrapeController;
