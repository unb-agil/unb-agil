import puppeteerSetup from '@/config/puppeteer';
import DepartmentService from '@/services/departmentService';
import { COMPONENTS_LINK } from '@/constants';
import { getDepartmentPresentationUrl } from '@/utils/urls';

class DepartmentScraper {
  private departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  private extractIds(options: HTMLOptionElement[]): number[] {
    return options
      .map((option) => parseInt(option.getAttribute('value') || '0', 10))
      .filter((id) => !isNaN(id));
  }

  async getDepartmentIds(): Promise<number[]> {
    const page = await puppeteerSetup.newPage();

    try {
      await page.goto(COMPONENTS_LINK);

      const optionsSelector = "select[id='form:unidades'] option";

      const departmentIds = await page.$$eval(optionsSelector, this.extractIds);

      return departmentIds;
    } catch (error) {
      console.error('Error fetching department IDs:', error);

      return [];
    } finally {
      await page.close();
    }
  }

  async scrapeDepartment(departmentId: number): Promise<void> {
    const page = await puppeteerSetup.newPage();

    try {
      const presentationUrl = getDepartmentPresentationUrl(departmentId);
      await page.goto(presentationUrl);

      const acronym = await page.$eval('h1', (element) => element.textContent);
      const title = await page.$eval('h2', (element) => element.textContent);

      if (!acronym || !title) {
        return;
      }

      await this.departmentService.createDepartment(
        departmentId,
        acronym,
        title,
      );
    } catch (error) {
      console.error(`Error scraping department ${departmentId}:`, error);
    } finally {
      await page.close();
    }
  }

  async scrape(): Promise<void> {
    const departmentIds = await this.getDepartmentIds();

    for (const departmentId of departmentIds) {
      await this.scrapeDepartment(departmentId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export default DepartmentScraper;
