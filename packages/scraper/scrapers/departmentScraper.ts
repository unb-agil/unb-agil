import puppeteerSetup from '../config/puppeteer';
import DepartmentService from '../services/departmentService';

class DepartmentScraper {
  private departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService();
  }

  async getDepartmentIds(): Promise<number[]> {
    const page = await puppeteerSetup.newPage();

    await page.goto('https://www.example.com');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.close();

    return [1, 2, 3];
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

    for (const departmentId of departmentIds) {
      await this.scrapeDepartment(departmentId);
    }
  }
}

export default DepartmentScraper;
