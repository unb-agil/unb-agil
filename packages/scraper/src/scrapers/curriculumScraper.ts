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
  private curriculumIds: Curriculum['id'][];
  private curriculumService: CurriculumService;

  constructor(options: CurriculumScraperOptions) {
    const { programSigaaId, curriculumIds = [] } = options;

    this.programSigaaId = programSigaaId;
    this.curriculumIds = curriculumIds;
    this.curriculumService = new CurriculumService();
  }

  static async accessCurriculumPage(page: Page, id: Curriculum['id']) {
    const row = `//td[contains(text(), "${id}")]/ancestor::tr`;
    const anchor = `${row}//a[contains(@title, "Relatório")]`;
    await page.locator(`::-p-xpath(${anchor})`).click();
    await page.waitForNavigation();
  }

  static async extractCurriculumIds(page: Page): Promise<string[]> {
    const selector = '#table_lt tr[class^="linha_"] td:nth-child(1)';

    const rawCurriculumIds = await page.$$eval(selector, (cells) =>
      cells.map((cell) => cell.innerText).filter((text) => text !== null),
    );

    const idPattern = /Detalhes da Estrutura Curricular (.+),/;
    const curriculumIds: string[] = rawCurriculumIds
      .map((rawId) => rawId?.match(idPattern)?.at(1) || null)
      .filter((id) => id !== null);

    return curriculumIds;
  }

  static async extractCurriculumData(page: Page): Promise<CurriculumData> {
    const rawData = {
      startPeriod: await this.extractAttribute(page, 'Entrada em Vigor'),
      minPeriods: await this.extractAttribute(page, 'Mínimo'),
      maxPeriods: await this.extractAttribute(page, 'Máximo'),
    };

    return {
      startPeriod: rawData.startPeriod,
      minPeriods: parseInt(rawData.minPeriods, 10),
      maxPeriods: parseInt(rawData.maxPeriods, 10),
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
    await this.scrapeCurriculumIds();
    await this.scrapeCurriculaData();
  }

  async scrapeCurriculumIds(): Promise<void> {
    const { programSigaaId } = this;
    const page =
      await ProgramScraper.accessProgramCurriculaPage(programSigaaId);
    this.curriculumIds = await CurriculumScraper.extractCurriculumIds(page);
    await this.curriculumService.storeIds(programSigaaId, this.curriculumIds);
    await page.close();
  }

  async scrapeCurriculaData(): Promise<void> {
    const { programSigaaId } = this;
    const page =
      await ProgramScraper.accessProgramCurriculaPage(programSigaaId);

    for (const curriculumId of this.curriculumIds) {
      await this.scrapeCurriculumData(page, curriculumId);
    }
  }

  async scrapeCurriculumData(page: Page, curriculumId: Curriculum['id']) {
    await CurriculumScraper.accessCurriculumPage(page, curriculumId);

    const data = await CurriculumScraper.extractCurriculumData(page);
    const curriculum: Curriculum = { id: curriculumId, ...data };
    await this.curriculumService.update(curriculum);

    await page.goBack();
  }
}

export default CurriculumScraper;
