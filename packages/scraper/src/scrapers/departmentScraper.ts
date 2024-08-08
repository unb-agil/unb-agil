import { Page } from 'puppeteer';

import puppeteerSetup from '@/config/puppeteer';
import DepartmentService from '@/services/departmentService';
import { DepartmentDetails } from '@/models/departmentModels';
import { getDepartmentPresentationUrl } from '@/utils/urls';
import { COMPONENTS_LINK } from '@/constants';

class DepartmentScraper {
  private departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  private evaluateIds(options: HTMLOptionElement[]): number[] {
    return options
      .map((option) => parseInt(option.getAttribute('value') || '0', 10))
      .filter((id) => id > 0);
  }

  private async extractDepartmentIds(page: Page): Promise<number[]> {
    const optionsSelector = "select[id='form:unidades'] option";
    const departmentIds = await page.$$eval(optionsSelector, this.evaluateIds);

    return departmentIds;
  }

  async scrapeAllDepartmentIds(): Promise<void> {
    const page = await puppeteerSetup.newPage();

    try {
      await page.goto(COMPONENTS_LINK);
      const departmentIds = await this.extractDepartmentIds(page);

      for (const departmentId of departmentIds) {
        await this.departmentService.storeDepartmentId(departmentId);
      }
    } catch (error) {
      console.error('Error fetching department IDs:', error);
    } finally {
      await page.close();
    }
  }

  private async extractDepartmentDetails(
    page: Page,
  ): Promise<DepartmentDetails> {
    const acronym = await page.$eval('h1', (element) => element.innerText);
    const title = await page.$eval('h2', (element) => element.innerText);

    return { acronym, title };
  }

  async scrapeDepartmentDetails(departmentId: number): Promise<void> {
    const page = await puppeteerSetup.newPage();
    const presentationUrl = getDepartmentPresentationUrl(departmentId);
    await page.goto(presentationUrl);

    const details = await this.extractDepartmentDetails(page);

    await this.departmentService.storeDepartmentDetails(departmentId, details);
  }

  async scrapeAllDepartmentDetails(): Promise<void> {
    const departmentIds = await this.departmentService.getDepartmentIds();

    for (const departmentId of departmentIds) {
      await this.scrapeDepartmentDetails(departmentId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async scrape(): Promise<void> {
    await this.scrapeAllDepartmentIds();
    await this.scrapeAllDepartmentDetails();
  }
}

export default DepartmentScraper;
