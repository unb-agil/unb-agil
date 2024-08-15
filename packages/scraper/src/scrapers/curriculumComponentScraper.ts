import chalk from 'chalk';
import { Page } from 'puppeteer';

import BaseScraper from '@/scrapers/baseScraper';
import ProgramScraper from '@/scrapers/programScraper';
import CurriculumScraper from '@/scrapers/curriculumScraper';
import CurriculumService from '@/services/curriculumService';
import ComponentService from '@/services/componentService';
import CurriculumComponentService from '@/services/curriculumComponentService';
import { Curriculum } from '@/models/curriculumModels';
import {
  CurriculumComponent,
  CurriculumComponentScraperOptions,
} from '@/models/curriculumComponentModels';
import { Program } from '@/models/programModels';

class CurriculumComponentScraper implements BaseScraper {
  private programSigaaId: Program['sigaaId'];
  private curriculumService: CurriculumService;
  private componentService: ComponentService;
  private curriculumComponentService: CurriculumComponentService;

  constructor(options: CurriculumComponentScraperOptions) {
    const { programSigaaId } = options;

    this.programSigaaId = programSigaaId;
    this.curriculumService = new CurriculumService();
    this.componentService = new ComponentService();
    this.curriculumComponentService = new CurriculumComponentService();
  }

  static async accessComponentPage(
    curriculumPage: Page,
    componentSigaaId: string,
  ) {
    const cell = `//td[contains(text(), "${componentSigaaId}")]`;
    const row = cell + '/ancestor::tr[contains(@class, "componentes")]';
    const anchor = row + '//a[contains(@title, "Detalhes")]';
    await curriculumPage.locator(`::-p-xpath(${anchor})`).click();
    await curriculumPage.waitForNavigation();
  }

  static async extractData(
    page: Page,
    curriculumSigaaId: Curriculum['sigaaId'],
  ) {
    const electiveComponents = await this.extractElectiveComponents(page);
    const periodComponents = await this.extractPeriodComponents(page);

    return this.formatCurriculumComponents(
      electiveComponents,
      periodComponents,
      curriculumSigaaId,
    );
  }

  static async extractElectiveComponents(page: Page): Promise<string[]> {
    const table = '//td[contains(text(), "Optativas")]/ancestor::table[1]';
    const cells = table + '//tr[contains(@class, "componentes")]//td[1]';
    const xpath = `::-p-xpath(${cells})`;
    return await page.$$eval(xpath, this.evaluateComponentSigaaId);
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

  static async extractComponentSigaaId(page: Page) {
    const xpath = '::-p-xpath(//tr[contains(@class, "componentes")]//td[1])';
    const ids = await page.$$eval(xpath, this.evaluateComponentSigaaId);
    const uniqueIds = Array.from(new Set(ids));

    return uniqueIds;
  }

  static evaluateComponentSigaaId(rows: Element[]): string[] {
    return rows.map(
      (el) => (el as HTMLTableCellElement).innerText.split(' - ')[0],
    );
  }

  static formatCurriculumComponents(
    electiveComponents: string[],
    periodComponents: string[][],
    curriculumSigaaId: Curriculum['sigaaId'],
  ): CurriculumComponent[] {
    const curriculumComponentsMap: Record<string, CurriculumComponent> = {};

    for (const elective of electiveComponents) {
      curriculumComponentsMap[elective] = {
        componentSigaaId: elective,
        curriculumSigaaId,
        type: 'ELECTIVE',
      };
    }

    for (let i = 0; i < periodComponents.length; i++) {
      for (const component of periodComponents[i]) {
        if (!curriculumComponentsMap[component]) {
          curriculumComponentsMap[component] = {
            componentSigaaId: component,
            curriculumSigaaId,
            type: 'MANDATORY',
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
    console.log(
      chalk.bold.black.bgMagentaBright('\n Componentes Curriculares'),
    );

    const page = await ProgramScraper.accessProgramCurriculaPage(
      this.programSigaaId,
    );

    const curriculumSigaaIds =
      await CurriculumScraper.extractCurriculumSigaaIds(page);

    await this.curriculumService.saveSigaaIds(curriculumSigaaIds);

    for (const curriculumSigaaId of curriculumSigaaIds) {
      await CurriculumScraper.accessCurriculumPage(page, curriculumSigaaId);
      const componentSigaaIds =
        await CurriculumComponentScraper.extractComponentSigaaId(page);

      await this.componentService.saveSigaaIds(componentSigaaIds);
      const curriculumComponents = await this.extractData(
        page,
        curriculumSigaaId,
      );
      await this.curriculumComponentService.batchUpdate(curriculumComponents);

      await page.goBack();
    }
  }

  async accessCurriculumComponentPage(
    curriculumSigaaId: Curriculum['sigaaId'],
  ) {
    const { sigaaId } =
      await this.curriculumService.getProgram(curriculumSigaaId);

    const page = await ProgramScraper.accessProgramCurriculaPage(sigaaId);
    await CurriculumScraper.accessCurriculumPage(page, curriculumSigaaId);

    return page;
  }

  async extractData(page: Page, curriculumSigaaId: Curriculum['sigaaId']) {
    return CurriculumComponentScraper.extractData(page, curriculumSigaaId);
  }
}

export default CurriculumComponentScraper;
