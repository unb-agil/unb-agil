import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import DepartmentScraper from '@/scrapers/departmentScraper';
import ProgramScraper from '@/scrapers/programScraper';
import CurriculumScraper from '@/scrapers/curriculumScraper';
import CurriculumComponentScraper from '@/scrapers/curriculumComponentScraper';
import ComponentScraper from '@/scrapers/componentScraper';

class ScrapeController {
  async scrapeByProgram(programSigaaIds: number[]) {
    const scrapers: BaseScraper[] = [
      new DepartmentScraper(), //
    ];

    programSigaaIds.forEach((programSigaaId) => {
      scrapers.push(new ProgramScraper({ programSigaaId }));
      scrapers.push(new CurriculumScraper({ programSigaaId }));
      scrapers.push(new CurriculumComponentScraper({ programSigaaId }));
      scrapers.push(new ComponentScraper({ programSigaaId }));
    });

    for (const scraper of scrapers) {
      console.log(`\n[${scraper.constructor.name}]`);
      await scraper.scrape();
    }

    await puppeteerSetup.closeBrowser();
  }
}

export default ScrapeController;
