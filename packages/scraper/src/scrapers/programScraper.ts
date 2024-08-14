import { Page } from 'puppeteer';

import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import ProgramService from '@/services/programService';
import {
  GRADUATION_PROGRAMS_URL,
  PROGRAM_CURRICULA_URL,
  PROGRAM_PRESENTATION_URL,
} from '@/constants';
import {
  Program,
  ProgramData,
  ProgramScraperOptions,
} from '@/models/programModels';

class ProgramScraper implements BaseScraper {
  private programIds: number[];
  private programService: ProgramService;

  constructor(options?: ProgramScraperOptions) {
    const { programId } = options || {};

    this.programIds = [];

    if (programId) {
      this.programIds.push(programId);
    }

    this.programService = new ProgramService();
  }

  static getProgramPresentationUrl(programId: Program['id']): string {
    return `${PROGRAM_PRESENTATION_URL}&id=${programId}`;
  }

  static getProgramCurriculaUrl(programId: Program['id']): string {
    return `${PROGRAM_CURRICULA_URL}&id=${programId}`;
  }

  static async accessAllProgramsPage() {
    const page = await puppeteerSetup.newPage();
    await page.goto(GRADUATION_PROGRAMS_URL);

    return page;
  }

  static async accessProgramPresentationPage(programId: Program['id']) {
    const page = await puppeteerSetup.newPage();
    const url = ProgramScraper.getProgramPresentationUrl(programId);
    await page.goto(url);

    return page;
  }

  static async accessProgramCurriculaPage(programId: Program['id']) {
    const page = await puppeteerSetup.newPage();
    const url = ProgramScraper.getProgramCurriculaUrl(programId);
    await page.goto(url);

    return page;
  }

  static async extractProgramIds(page: Page): Promise<number[]> {
    const selector = 'a[title="Visualizar Página do Curso"]';
    const programIds = await page.$$eval(selector, this.evaluateProgramIds);

    return programIds;
  }

  static evaluateProgramIds(anchors: Element[]): number[] {
    return (anchors as HTMLAnchorElement[]).map((anchor) =>
      parseInt(anchor.href.split('=')[1], 10),
    );
  }

  static async extractProgramData(page: Page): Promise<ProgramData> {
    return {
      title: await ProgramScraper.extractProgramTitle(page),
      departmentId: await ProgramScraper.extractProgramDepartmentId(page),
    };
  }

  static async extractProgramTitle(page: Page): Promise<string> {
    return page.$eval(
      'span.nome_curso',
      (element) => element.innerText.split(' / ')[0].split('CURSO DE ')[1],
    );
  }

  static async extractProgramDepartmentId(page: Page): Promise<number> {
    return page.$eval('span.nome_centro a', (element) =>
      parseInt(element.getAttribute('href')?.split('id=')[1] || '0', 10),
    );
  }

  async scrape() {
    if (this.programIds.length === 0) {
      await this.scrapeProgramIds();
    }

    await this.scrapeProgramsData();
  }

  async scrapeProgramIds(): Promise<void> {
    const page = await ProgramScraper.accessAllProgramsPage();
    this.programIds = await ProgramScraper.extractProgramIds(page);
    await this.programService.storeIds(this.programIds);
  }

  async scrapeProgramsData(): Promise<void> {
    for (const programId of this.programIds) {
      await this.scrapeProgramData(programId);
    }
  }

  async scrapeProgramData(programId: number): Promise<void> {
    const page = await ProgramScraper.accessProgramPresentationPage(programId);
    const data = await ProgramScraper.extractProgramData(page);
    const program: Program = { id: programId, ...data };
    await this.programService.update(program);
    await page.close();
  }
}

export default ProgramScraper;
