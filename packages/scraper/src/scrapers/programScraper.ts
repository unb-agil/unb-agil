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
  private programSigaaIds: number[];
  private programService: ProgramService;

  constructor(options?: ProgramScraperOptions) {
    const { programSigaaId } = options || {};

    this.programSigaaIds = [];

    if (programSigaaId) {
      this.programSigaaIds.push(programSigaaId);
    }

    this.programService = new ProgramService();
  }

  static getProgramPresentationUrl(programSigaaId: Program['sigaaId']): string {
    return `${PROGRAM_PRESENTATION_URL}&id=${programSigaaId}`;
  }

  static getProgramCurriculaUrl(programSigaaId: Program['sigaaId']): string {
    return `${PROGRAM_CURRICULA_URL}&id=${programSigaaId}`;
  }

  static async accessAllProgramsPage() {
    const page = await puppeteerSetup.newPage();
    await page.goto(GRADUATION_PROGRAMS_URL);

    return page;
  }

  static async accessProgramPresentationPage(
    programSigaaId: Program['sigaaId'],
  ) {
    const page = await puppeteerSetup.newPage();
    const url = ProgramScraper.getProgramPresentationUrl(programSigaaId);
    await page.goto(url);

    return page;
  }

  static async accessProgramCurriculaPage(programSigaaId: Program['sigaaId']) {
    const page = await puppeteerSetup.newPage();
    const url = ProgramScraper.getProgramCurriculaUrl(programSigaaId);
    await page.goto(url);

    return page;
  }

  static async extractProgramSigaaIds(page: Page): Promise<number[]> {
    const selector = 'a[title="Visualizar Página do Curso"]';
    const programSigaaIds = await page.$$eval(selector, this.evaluateSigaaIds);

    return programSigaaIds;
  }

  static evaluateSigaaIds(anchors: Element[]): number[] {
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
    if (this.programSigaaIds.length === 0) {
      await this.scrapeProgramSigaaIds();
    }

    await this.scrapeProgramsData();
  }

  async scrapeProgramSigaaIds(): Promise<void> {
    const page = await ProgramScraper.accessAllProgramsPage();
    this.programSigaaIds = await ProgramScraper.extractProgramSigaaIds(page);
    await this.programService.saveSigaaIds(this.programSigaaIds);
  }

  async scrapeProgramsData(): Promise<void> {
    for (const programSigaaId of this.programSigaaIds) {
      await this.scrapeProgramData(programSigaaId);
    }
  }

  async scrapeProgramData(programSigaaId: number): Promise<void> {
    const page =
      await ProgramScraper.accessProgramPresentationPage(programSigaaId);
    const data = await ProgramScraper.extractProgramData(page);
    const program: Program = { sigaaId: programSigaaId, ...data };
    await this.programService.saveOrUpdate(program);
    await page.close();
  }
}

export default ProgramScraper;
