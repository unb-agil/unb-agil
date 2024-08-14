import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import DepartmentScraper from '@/scrapers/departmentScraper';
import ProgramScraper from '@/scrapers/programScraper';
import CurriculumScraper from '@/scrapers/curriculumScraper';
import CurriculumComponentScraper from '@/scrapers/curriculumComponentScraper';
import ComponentScraper from '@/scrapers/componentScraper';

class ScrapeController {
  async scrapeByProgram(programIds: number[]) {
    const scrapers: BaseScraper[] = [new DepartmentScraper()];

    programIds.forEach((programId) => {
      scrapers.push(new ProgramScraper({ programId }));
      scrapers.push(new CurriculumScraper({ programId }));
      scrapers.push(new CurriculumComponentScraper({ programId }));
      scrapers.push(new ComponentScraper({ programId }));
    });

    for (const scraper of scrapers) {
      console.log(`\n[${scraper.constructor.name}]`);
      await scraper.scrape();
    }

    await puppeteerSetup.closeBrowser();
  }
}

export default ScrapeController;
