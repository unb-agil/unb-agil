import { Page } from 'puppeteer';

import BaseScraper from '@/scrapers/baseScraper';
import ProgramScraper from '@/scrapers/programScraper';
import CurriculumScraper from '@/scrapers/curriculumScraper';
import CurriculumService from '@/services/curriculumService';
import CurriculumComponentService from '@/services/curriculumComponentService';
import { Curriculum } from '@/models/curriculumModels';
import {
  CurriculumComponent,
  CurriculumComponentScraperOptions,
} from '@/models/curriculumComponentModels';
import { Program } from '@/models/programModels';

class CurriculumComponentScraper implements BaseScraper {
  private programId: Program['id'];
  private curriculumIds?: Curriculum['id'][];
  private curriculumService: CurriculumService;
  private curriculumComponentService: CurriculumComponentService;

  constructor(options: CurriculumComponentScraperOptions) {
    const { programId } = options;

    this.programId = programId;
    this.curriculumService = new CurriculumService();
    this.curriculumComponentService = new CurriculumComponentService();
  }

  static async accessComponentPage(curriculumPage: Page, componentId: string) {
    const cell = `//td[contains(text(), "${componentId}")]`;
    const row = cell + '/ancestor::tr[contains(@class, "componentes")]';
    const anchor = row + '//a[contains(@title, "Detalhes")]';
    await curriculumPage.locator(`::-p-xpath(${anchor})`).click();
    await curriculumPage.waitForNavigation();
  }

  static async extractData(page: Page, curriculumId: Curriculum['id']) {
    const electiveComponents = await this.extractElectiveComponents(page);
    const periodComponents = await this.extractPeriodComponents(page);

    return this.formatCurriculumComponents(
      electiveComponents,
      periodComponents,
      curriculumId,
    );
  }

  static async extractElectiveComponents(page: Page): Promise<string[]> {
    const table = '//td[contains(text(), "Optativas")]/ancestor::table[1]';
    const cells = table + '//tr[contains(@class, "componentes")]//td[1]';
    const xpath = `::-p-xpath(${cells})`;
    return await page.$$eval(xpath, this.evaluateComponentIds);
  }

  static async extractPeriodComponents(page: Page): Promise<string[][]> {
    const table = '//td[contains(text(), "Nível")]/ancestor::table[1]//tr';
    const xpath = `::-p-xpath(${table})`;

    const ids = await page.$$eval(xpath, (rows) => {
      const ids: string[][] = [];
      let periodIndex = -1;

      for (const row of rows) {
        if (row.classList.contains('tituloRelatorio')) {
          periodIndex++;
          ids[periodIndex] = [];
        } else if (row.classList.contains('componentes')) {
          const id = (row as HTMLTableRowElement).cells[0].innerText.split(
            ' - ',
          )[0];
          ids[periodIndex].push(id);
        }
      }

      return ids;
    });

    return ids;
  }

  static async extractComponentIds(page: Page): Promise<string[]> {
    const xpath = '::-p-xpath(//tr[contains(@class, "componentes")]//td[1])';
    return await page.$$eval(xpath, this.evaluateComponentIds);
  }

  static evaluateComponentIds(rows: Element[]): string[] {
    return rows.map(
      (el) => (el as HTMLTableCellElement).innerText.split(' - ')[0],
    );
  }

  static formatCurriculumComponents(
    electiveComponents: string[],
    periodComponents: string[][],
    curriculumId: Curriculum['id'],
  ): CurriculumComponent[] {
    const curriculumComponentsMap: Record<string, CurriculumComponent> = {};

    for (const elective of electiveComponents) {
      curriculumComponentsMap[elective] = {
        componentId: elective,
        curriculumId,
        isMandatory: false,
      };
    }

    for (let i = 0; i < periodComponents.length; i++) {
      for (const component of periodComponents[i]) {
        if (!curriculumComponentsMap[component]) {
          curriculumComponentsMap[component] = {
            componentId: component,
            curriculumId,
            isMandatory: true,
            recommendedPeriod: i + 1,
          };
        } else {
          curriculumComponentsMap[component].recommendedPeriod = i + 1;
        }
      }
    }

    const sorted = Object.values(curriculumComponentsMap).sort(
      (a, b) => (a.recommendedPeriod || 0) - (b.recommendedPeriod || 0),
    );

    return sorted;
  }

  async scrape(): Promise<void> {
    const page = await ProgramScraper.accessProgramCurriculaPage(
      this.programId,
    );

    const curriculumIds = await CurriculumScraper.extractCurriculumIds(page);
    await this.curriculumService.storeIds(this.programId, curriculumIds);

    for (const curriculumId of curriculumIds) {
      await CurriculumScraper.accessCurriculumPage(page, curriculumId);
      const curriculumComponents = await this.extractData(page, curriculumId);
      await this.curriculumComponentService.batchUpdate(curriculumComponents);

      await page.goBack();
    }
  }

  async accessCurriculumComponentPage(curriculumId: Curriculum['id']) {
    const program = await this.curriculumService.getProgram(curriculumId);
    const page = await ProgramScraper.accessProgramCurriculaPage(program.id);
    await CurriculumScraper.accessCurriculumPage(page, curriculumId);

    return page;
  }

  async extractData(page: Page, curriculumId: Curriculum['id']) {
    return CurriculumComponentScraper.extractData(page, curriculumId);
  }
}

export default CurriculumComponentScraper;
