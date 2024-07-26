import puppeteerSetup from '../config/puppeteer';
import DepartmentService from '../services/departmentService';
import { COMPONENTS_LINK } from '../constants';

class DepartmentScraper {
  private departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  async getDepartmentIds(): Promise<number[]> {
    const page = await puppeteerSetup.newPage();

    await page.goto(COMPONENTS_LINK);

    const departmentIds = await page.$$eval(
      "select[id='form:unidades'] option",
      (elements) => {
        const ids: number[] = [];

        for (const element of elements) {
          const value = element.getAttribute('value');

          if (value === null) {
            continue;
          }

          const id = parseInt(value, 10);

          if (id <= 0) {
            continue;
          }

          ids.push(id);
        }

        return ids;
      },
    );

    await page.close();

    return departmentIds;
  }

  async scrapeDepartment(departmentId: number): Promise<void> {
    const page = await puppeteerSetup.newPage();

    await page.goto(`https://www.example.com`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.close();

    await this.departmentService.createDepartment(departmentId);
  }

  async scrape(): Promise<void> {
    const departmentIds = await this.getDepartmentIds();

    console.log(`Department ids: ${departmentIds}`);
  }
}

export default DepartmentScraper;
