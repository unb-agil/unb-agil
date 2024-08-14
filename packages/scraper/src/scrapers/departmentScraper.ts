import { Page } from 'puppeteer';

import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import ComponentScraper from '@/scrapers/componentScraper';
import DepartmentService from '@/services/departmentService';
import { DEPARTMENT_PRESENTATION_BASE_URL } from '@/constants';
import {
  Department,
  DepartmentData,
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

  public static async accessPresentationPage(departmentId: number) {
    const page = await puppeteerSetup.newPage();
    const url = this.getDepartmentPresentationUrl(departmentId);
    await page.goto(url);

    return page;
  }

  public static getDepartmentPresentationUrl(departmentId: number) {
    return `${DEPARTMENT_PRESENTATION_BASE_URL}?id=${departmentId}`;
  }

  private static async extractDepartmentIds(page: Page): Promise<number[]> {
    const optionsSelector = "select[id='form:unidades'] option";
    const departmentIds = await page.$$eval(optionsSelector, this.evaluateIds);

    return departmentIds;
  }

  private static evaluateIds(options: HTMLOptionElement[]): number[] {
    return options
      .map((option) => parseInt(option.getAttribute('value') || '0', 10))
      .filter((id) => id > 0);
  }

  private static async extractDepartmentData(page: Page) {
    const data: DepartmentData = {
      acronym: await page.$eval('h1', (element) => element.innerText),
      title: await page.$eval('h2', (element) => element.innerText),
    };

    return data;
  }

  public async scrape() {
    if (this.departmentIds.length === 0) {
      await this.scrapeDepartmentIds();
    }

    await this.scrapeDepartmentsData();
  }

  public async scrapeDepartmentIds() {
    const page = await ComponentScraper.accessComponentsPage();
    this.departmentIds = await DepartmentScraper.extractDepartmentIds(page);
    await this.departmentService.saveIds(this.departmentIds);

    await page.close();
  }

  public async scrapeDepartmentsData() {
    for (const departmentId of this.departmentIds) {
      const page = await DepartmentScraper.accessPresentationPage(departmentId);
      const data = await DepartmentScraper.extractDepartmentData(page);
      const department: Department = { id: departmentId, ...data };
      await this.departmentService.saveOrUpdate(department);

      await page.close();
    }
  }
}

export default DepartmentScraper;
