import { Page } from 'puppeteer';
import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import CurriculumService from '@/services/curriculumService';
import CurriculumComponentService from '@/services/curriculumComponentService';
import { getProgramCurriculaUrl } from '@/utils/urls';
import {
  CurriculumComponent,
  CurriculumComponentScraperOptions,
} from '@/models/curriculumComponentModels';

class CurriculumComponentScraper implements BaseScraper {
  private curriculumIds: string[];
  private curriculumService: CurriculumService;
  private curriculumComponentService: CurriculumComponentService;

  constructor(options: CurriculumComponentScraperOptions) {
    const { curriculumIds } = options;

    this.curriculumIds = curriculumIds;
    this.curriculumService = new CurriculumService();
    this.curriculumComponentService = new CurriculumComponentService();
  }

  async scrape(): Promise<void> {
    await this.scrapeAllCurriculumComponents();
  }

  async scrapeAllCurriculumComponents(): Promise<void> {
    for (const curriculumId of this.curriculumIds) {
      await this.scrapeComponentsFromCurriculum(curriculumId);
    }
  }

  async scrapeComponentsFromCurriculum(curriculumId: string): Promise<void> {
    console.log(`Scraping components from curriculum ${curriculumId}`);
    const page = await puppeteerSetup.newPage();
    const programId = await this.curriculumService.getProgramId(curriculumId);
    const url = getProgramCurriculaUrl(programId);
    await page.goto(url);

    const row = `//td[contains(text(), "${curriculumId}")]/ancestor::tr`;
    const anchor = `${row}//a[contains(@title, "Relatório")]`;
    await page.locator(`::-p-xpath(${anchor})`).click();
    await page.waitForNavigation();

    const electiveComponents = await this.extractElectiveComponents(page);
    const periodComponents = await this.extractPeriodComponents(page);

    const formattedComponents = this.formatComponents(
      electiveComponents,
      periodComponents,
      curriculumId,
    );

    for (const component of formattedComponents) {
      await this.curriculumComponentService.createCurriculumComponent(
        component,
      );
    }

    await page.close();
  }

  private async extractElectiveComponents(page: Page): Promise<string[]> {
    const table = '//td[contains(text(), "Optativas")]/ancestor::table[1]';
    const cells = table + '//tr[contains(@class, "componentes")]//td[1]';
    const xpath = `::-p-xpath(${cells})`;

    const ids = await page.$$eval(xpath, (elements) =>
      elements.map(
        (el) => (el as HTMLTableCellElement).innerText.split(' - ')[0],
      ),
    );

    return ids;
  }

  private async extractPeriodComponents(page: Page): Promise<string[][]> {
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

  private formatComponents(
    electiveComponents: string[],
    periodComponents: string[][],
    curriculumId: string,
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
}

export default CurriculumComponentScraper;
