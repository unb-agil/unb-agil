import { Page } from 'puppeteer';

import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import ProgramService from '@/services/programService';
import DepartmentService from '@/services/departmentService';
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
    const title = await this.extractProgramTitle(page);

    const departmentTitle = await this.extractDepartmentTitle(page);
    const departmentService = new DepartmentService();
    const { sigaaId } = await departmentService.get({ title: departmentTitle });

    return {
      title,
      departmentSigaaId: sigaaId,
    };
  }

  static async extractProgramTitle(page: Page): Promise<string> {
    const selector = 'span.nome_curso';
    const raw = await page.$eval(selector, (el) => el.innerText);
    const title = raw.split(' / ')[0].split('CURSO DE ')[1];

    return title;
  }

  static async extractDepartmentTitle(page: Page) {
    const selector = 'span.nome_centro a';
    const innerText = await page.$eval(selector, (el) => el.innerText);
    const title = innerText.split(' - ')[0];

    return title;
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
    console.log(program);
    await this.programService.saveOrUpdate(program);
    await page.close();
  }
}

export default ProgramScraper;
