import { Page } from 'puppeteer';

import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import CurriculumService from '@/services/curriculumService';
import { getProgramCurriculaUrl } from '@/utils/urls';
import {
  CurriculumDetails,
  CurriculumScraperOptions,
} from '@/models/curriculumModels';

class CurriculumScraper implements BaseScraper {
  private programIds: number[];
  private curriculumService: CurriculumService;

  constructor(options: CurriculumScraperOptions) {
    const { programIds } = options;

    this.programIds = programIds;
    this.curriculumService = new CurriculumService();
  }

  async scrape(): Promise<void> {
    await this.scrapeAllCurriculumIds();
    await this.scrapeAllCurriculumDetails();
  }

  async scrapeAllCurriculumIds(): Promise<void> {
    const page = await puppeteerSetup.newPage();

    for (const programId of this.programIds) {
      const url = getProgramCurriculaUrl(programId);
      await page.goto(url);

      const curriculumIds = await this.extractCurriculumIds(page);

      await this.curriculumService.storeCurriculumIds(programId, curriculumIds);
    }
  }

  async scrapeAllCurriculumDetails(): Promise<void> {
    for (const programId of this.programIds) {
      const curriculumIds =
        await this.curriculumService.getAllCurriculumIdsByProgramId(programId);

      await this.scrapeCurriculumDetails(programId, curriculumIds);
    }
  }

  async scrapeCurriculumDetails(
    programId: number,
    curriculumIds: string[],
  ): Promise<void> {
    const page = await puppeteerSetup.newPage();
    const url = getProgramCurriculaUrl(programId);
    await page.goto(url);

    for (const curriculumId of curriculumIds) {
      const row = `//td[contains(text(), "${curriculumId}")]/ancestor::tr`;
      const anchor = `${row}//a[contains(@title, "Relatório")]`;
      await page.locator(`::-p-xpath(${anchor})`).click();
      await page.waitForNavigation();

      const curriculumDetails = await this.extractCurriculumDetails(page);
      await this.curriculumService.storeCurriculumDetails(curriculumDetails);

      await page.goBack();
    }
  }

  private async extractCurriculumIds(page: Page): Promise<string[]> {
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

  async extractCurriculumDetails(page: Page): Promise<CurriculumDetails> {
    const rawCurriculumDetails = {
      id: await this.extractAttribute(page, 'Código'),
      startPeriod: await this.extractAttribute(page, 'Entrada em Vigor'),
      minPeriods: await this.extractAttribute(page, 'Mínimo'),
      maxPeriods: await this.extractAttribute(page, 'Máximo'),
    };

    const curriculumDetails: CurriculumDetails = {
      id: rawCurriculumDetails.id,
      startPeriod: rawCurriculumDetails.startPeriod,
      minPeriods: parseInt(rawCurriculumDetails.minPeriods, 10),
      maxPeriods: parseInt(rawCurriculumDetails.maxPeriods, 10),
    };

    return curriculumDetails;
  }

  private async extractAttribute(
    page: Page,
    attribute: string,
  ): Promise<string> {
    const xpath = `//th[contains(text(), "${attribute}")]/following-sibling::td[1]`;
    return await page.$eval(
      `::-p-xpath(${xpath})`,
      (element) => (element as HTMLTableCellElement).innerText,
    );
  }
}

export default CurriculumScraper;
