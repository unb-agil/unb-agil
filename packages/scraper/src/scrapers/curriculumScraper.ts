import chalk from 'chalk';
import { Page } from 'puppeteer';

import BaseScraper from '@/scrapers/baseScraper';
import ProgramScraper from '@/scrapers/programScraper';
import CurriculumService from '@/services/curriculumService';
import { Program } from '@/models/programModels';
import {
  Curriculum,
  CurriculumData,
  CurriculumScraperOptions,
} from '@/models/curriculumModels';

class CurriculumScraper implements BaseScraper {
  private programSigaaId: Program['sigaaId'];
  private curriculumSigaaIds: Curriculum['sigaaId'][];
  private curriculumService: CurriculumService;

  constructor(options: CurriculumScraperOptions) {
    const { programSigaaId, curriculumSigaaIds = [] } = options;

    this.programSigaaId = programSigaaId;
    this.curriculumSigaaIds = curriculumSigaaIds;
    this.curriculumService = new CurriculumService();
  }

  static async accessCurriculumPage(page: Page, id: Curriculum['sigaaId']) {
    const row = `//td[contains(text(), "${id}")]/ancestor::tr`;
    const anchor = `${row}//a[contains(@title, "Relatório")]`;
    await page.locator(`::-p-xpath(${anchor})`).click();
    await page.waitForNavigation();
  }

  static async extractCurriculumSigaaIds(page: Page): Promise<string[]> {
    const selector = '#table_lt tr[class^="linha_"] td:nth-child(1)';

    const rawCurriculumSigaaIds = await page.$$eval(selector, (cells) =>
      cells.map((cell) => cell.innerText).filter((text) => text !== null),
    );

    const idPattern = /Detalhes da Estrutura Curricular (.+),/;
    const curriculumSigaaIds: string[] = rawCurriculumSigaaIds
      .map((rawId) => rawId?.match(idPattern)?.at(1) || null)
      .filter((id) => id !== null);

    return curriculumSigaaIds;
  }

  static async extractCurriculumData(
    page: Page,
    programSigaaId: Program['sigaaId'],
  ): Promise<CurriculumData> {
    const rawData = {
      startPeriod: await this.extractAttribute(page, 'Entrada em Vigor'),
      minPeriods: await this.extractAttribute(page, 'Mínimo'),
      maxPeriods: await this.extractAttribute(page, 'Máximo'),
    };

    return {
      startPeriod: rawData.startPeriod,
      minPeriods: parseInt(rawData.minPeriods, 10),
      maxPeriods: parseInt(rawData.maxPeriods, 10),
      programSigaaId,
    };
  }

  static async extractAttribute(page: Page, attributeTitle: string) {
    const xpath = `//th[contains(text(), "${attributeTitle}")]/following-sibling::td[1]`;

    return await page.$eval(
      `::-p-xpath(${xpath})`,
      (element) => (element as HTMLTableCellElement).innerText,
    );
  }

  async scrape(): Promise<void> {
    console.log(chalk.bold.black.bgBlueBright('\nCurrículos'));
    await this.scrapeCurriculumSigaaIds();
    await this.scrapeCurriculaData();
  }

  async scrapeCurriculumSigaaIds(): Promise<void> {
    const page = await ProgramScraper.accessProgramCurriculaPage(
      this.programSigaaId,
    );

    this.curriculumSigaaIds =
      await CurriculumScraper.extractCurriculumSigaaIds(page);

    await this.curriculumService.saveSigaaIds(this.curriculumSigaaIds);

    await page.close();
  }

  async scrapeCurriculaData(): Promise<void> {
    const { programSigaaId } = this;
    const page =
      await ProgramScraper.accessProgramCurriculaPage(programSigaaId);

    for (const curriculumSigaaId of this.curriculumSigaaIds) {
      await this.scrapeCurriculumData(page, curriculumSigaaId);
    }
  }

  async scrapeCurriculumData(
    page: Page,
    curriculumSigaaId: Curriculum['sigaaId'],
  ) {
    await CurriculumScraper.accessCurriculumPage(page, curriculumSigaaId);

    const data = await CurriculumScraper.extractCurriculumData(
      page,
      this.programSigaaId,
    );

    const curriculum: Curriculum = { sigaaId: curriculumSigaaId, ...data };
    await this.curriculumService.saveOrUpdate(curriculum);

    await page.goBack();
  }
}

export default CurriculumScraper;
