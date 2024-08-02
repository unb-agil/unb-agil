import DepartmentScraper from '@/scrapers/departmentScraper';
import puppeteerSetup from '@/config/puppeteer';

class ScrapeController {
  async scrapeAll(): Promise<void> {
    const scrapers = [
      new DepartmentScraper(),
      // Add other scrapers as needed
    ];

    for (const scraper of scrapers) {
      await scraper.scrape();
    }

    await puppeteerSetup.closeBrowser();
  }

  async scrapeDepartment(): Promise<void> {
    const departmentScraper = new DepartmentScraper();
    await departmentScraper.scrape();
    await puppeteerSetup.closeBrowser();
  }

  // Add other individual scrape methods as needed
}

export default ScrapeController;
