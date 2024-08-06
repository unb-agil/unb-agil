import { Page } from 'puppeteer';
import puppeteerSetup from '@/config/puppeteer';
import ProgramService from '@/services/programService';
import { getProgramCurriculaUrl } from '@/utils/urls';

class CurriculumScraper {
  private programService: ProgramService;
  // private curriculumService: CurriculumService;

  constructor() {
    this.programService = new ProgramService();
    // this.curriculumService = new this.curriculumService();
  }

  async getCurriculumIds(page: Page) {
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

  async scrapeCurriculumDetails() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  async scrapeCurriculum(programId: number): Promise<void> {
    const page = await puppeteerSetup.newPage();

    try {
      const url = getProgramCurriculaUrl(programId);
      await page.goto(url);

      const curriculumIds = await this.getCurriculumIds(page);

      for (const id of curriculumIds) {
        const row = `//td[contains(text(), "${id}")]/ancestor`;
        const anchor = `${row}::tr//a[contains(@title, "Relatório")]`;
        await page.locator(`::-p-xpath(${anchor})`).click();
        await page.waitForNavigation();

        await this.scrapeCurriculumDetails();

        await page.goBack();
      }
    } catch (error) {
      console.error('Error scraping curricula:', error);
    } finally {
      await page.close();
    }
  }

  async getProgramIdsToScrape(programIds?: number[]): Promise<number[]> {
    if (programIds) {
      return programIds;
    }

    return await this.programService.getAllIds();
  }

  async scrape(programIds?: number[]): Promise<void> {
    const programIdsToScrape = await this.getProgramIdsToScrape(programIds);

    for (const programId of programIdsToScrape) {
      await this.scrapeCurriculum(programId);
    }
  }
}

export default CurriculumScraper;
