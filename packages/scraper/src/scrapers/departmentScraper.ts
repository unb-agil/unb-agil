import { Page } from 'puppeteer';

import BaseScraper from '@/scrapers/baseScraper';
import puppeteerSetup from '@/config/puppeteer';
import DepartmentService from '@/services/departmentService';
import { getDepartmentPresentationUrl } from '@/utils/urls';
import { COMPONENTS_LINK } from '@/constants';
import {
  DepartmentDetails,
  DepartmentScraperOptions,
} from '@/models/departmentModels';

class DepartmentScraper implements BaseScraper {
  private departmentIds: number[];
  private departmentService: DepartmentService;

  constructor(options?: DepartmentScraperOptions) {
    const { departmentIds = [] } = options || {};

    this.departmentIds = departmentIds;
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
      this.departmentIds = await this.extractDepartmentIds(page);

      for (const departmentId of this.departmentIds) {
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

  private async getDepartmentIds(): Promise<number[]> {
    if (this.departmentIds.length === 0) {
      this.departmentIds = await this.departmentService.fetchAllDepartmentIds();
    }

    return this.departmentIds;
  }

  async scrapeAllDepartmentDetails(): Promise<void> {
    const departmentIds = await this.getDepartmentIds();

    for (const departmentId of departmentIds) {
      await this.scrapeDepartmentDetails(departmentId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async scrape(): Promise<void> {
    if (this.departmentIds.length === 0) {
      await this.scrapeAllDepartmentIds();
    }

    await this.scrapeAllDepartmentDetails();
  }
}

export default DepartmentScraper;
