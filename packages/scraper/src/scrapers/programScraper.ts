import puppeteerSetup from '@/config/puppeteer';
import { GRADUATION_PROGRAMS_URL } from '@/constants';
import DepartmentService from '@/services/departmentService';
import ProgramService from '@/services/programService';

interface ScrapedProgram {
  id: number;
  title: string;
  degree: string;
  shift: string;
  campus: string;
  departmentAcronym: string;
  departmentTitle: string;
}

class ProgramScraper {
  private departmentService: DepartmentService;
  private programService: ProgramService;

  constructor() {
    this.departmentService = new DepartmentService();
    this.programService = new ProgramService();
  }

  async extractPrograms(
    rows: HTMLTableRowElement[],
  ): Promise<ScrapedProgram[]> {
    let currentDepartmentTitle = '';
    let departmentAcronym = '';
    let departmentTitle = '';

    const cleanText = (text: string | null) =>
      text?.replace(/[\n\t]/g, '').trim() || '';

    const result: ScrapedProgram[] = [];

    for (const row of rows) {
      const columns = row.querySelectorAll('td');

      if (!row.classList.length) {
        currentDepartmentTitle = cleanText(row.textContent);
        departmentAcronym = currentDepartmentTitle.split(' - ')[0];
        departmentTitle = currentDepartmentTitle.split(' - ')[1];
        continue;
      }

      if (
        row.classList.contains('linhaImpar') ||
        row.classList.contains('linhaPar')
      ) {
        const title = cleanText(columns[0].textContent);
        const degree = cleanText(columns[1].textContent);
        const shift = cleanText(columns[2].textContent);
        const campus = cleanText(columns[3].textContent);
        const id = parseInt(
          columns[6].querySelector('a')?.getAttribute('href')?.split('=')[1] ||
            '0',
          10,
        );

        result.push({
          id,
          title,
          degree,
          shift,
          campus,
          departmentAcronym,
          departmentTitle,
        });
      }
    }

    return result;
  }

  async scrapeAllPrograms(): Promise<ScrapedProgram[]> {
    const page = await puppeteerSetup.newPage();

    try {
      await page.goto(GRADUATION_PROGRAMS_URL);

      const programs = await page.$$eval('tr', this.extractPrograms, page);

      return programs;
    } catch (error) {
      console.error('Error scraping programs:', error);

      return [];
    } finally {
      await page.close();
    }
  }

  async scrape(): Promise<void> {
    const programs = await this.scrapeAllPrograms();

    for (const program of programs) {
      await this.programService.createProgram(
        program.id,
        program.title,
        program.degree,
        program.shift,
        program.campus,
        program.departmentAcronym,
        program.departmentTitle,
      );
    }
  }
}

export default ProgramScraper;
