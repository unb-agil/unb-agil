import { Page } from 'puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import puppeteerSetup from '@/config/puppeteer';
import ProgramService from '@/services/programService';
import { GRADUATION_PROGRAMS_URL } from '@/constants';
import { getProgramPresentationUrl } from '@/utils/urls';
import { ProgramScraperOptions } from '@/models/programModels';

class ProgramScraper implements BaseScraper {
  private programIds: number[];
  private programService: ProgramService;

  constructor(options?: ProgramScraperOptions) {
    const { programIds = [] } = options || {};

    this.programIds = programIds;
    this.programService = new ProgramService();
  }

  async scrape() {
    if (this.programIds.length === 0) {
      await this.scrapeAllProgramIds();
    }

    await this.scrapeAllProgramDetails();
  }

  async scrapeAllProgramIds(): Promise<void> {
    const page = await puppeteerSetup.newPage();
    await page.goto(GRADUATION_PROGRAMS_URL);

    const programIds = await this.extractProgramIds(page);
    await this.programService.storeProgramIds(programIds);
  }

  async scrapeAllProgramDetails(): Promise<void> {
    this.programIds = await this.getProgramIds();

    for (const programId of this.programIds) {
      await this.scrapeProgramDetails(programId);
    }
  }

  async scrapeProgramDetails(programId: number): Promise<void> {
    const page = await puppeteerSetup.newPage();
    const url = getProgramPresentationUrl(programId);
    await page.goto(url);

    const title = await this.extractProgramTitle(page);
    const departmentId = await this.extractProgramDepartmentId(page);

    await this.programService.storeProgram(title, departmentId);
  }

  private async extractProgramIds(page: Page): Promise<number[]> {
    const selector = 'a[title="Visualizar Página do Curso"]';
    const programIds = await page.$$eval(selector, (anchors) =>
      anchors.map((anchors) => {
        const href = anchors.getAttribute('href') || '';

        return parseInt(href.split('=')[1], 10);
      }),
    );

    return programIds;
  }

  private async getProgramIds(): Promise<number[]> {
    if (this.programIds.length === 0) {
      return await this.programService.fetchProgramIds();
    }

    return this.programIds;
  }

  private async extractProgramTitle(page: Page): Promise<string> {
    return page.$eval(
      'span.nome_curso',
      (element) => element.innerText.split(' / ')[0].split('CURSO DE ')[1],
    );
  }

  private async extractProgramDepartmentId(page: Page): Promise<number> {
    return page.$eval('span.nome_centro a', (element) =>
      parseInt(element.getAttribute('href')?.split('id=')[1] || '0', 10),
    );
  }
}

export default ProgramScraper;
