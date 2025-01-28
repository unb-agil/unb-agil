import puppeteerSetup from '#config/puppeteer.js';
import BaseScraper from '#scrapers/baseScraper.js';
import DepartmentScraper from '#scrapers/departmentScraper.js';
import ProgramScraper from '#scrapers/programScraper.js';
import CurriculumScraper from '#scrapers/curriculumScraper.js';
import CurriculumComponentScraper from '#scrapers/curriculumComponentScraper.js';
import ComponentScraper from '#scrapers/componentScraper.js';
import { COMPONENTS_LINK } from '#constants.js';

class ScrapeController {
  static async closeCookiesDialog() {
    const page = await puppeteerSetup.newPage();
    await page.goto(COMPONENTS_LINK);
    const button = await page.$('dialog#sigaa-cookie-consent button');
    await button?.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await page.close();
  }

  async scrapeByProgram(programSigaaIds: number[]) {
    await ScrapeController.closeCookiesDialog();

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
      await scraper.scrape();
    }

    await puppeteerSetup.closeBrowser();
  }
}

export default ScrapeController;
