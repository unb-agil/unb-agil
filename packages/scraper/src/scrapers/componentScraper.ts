import { Page } from 'puppeteer';

import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import ProgramScraper from '@/scrapers/programScraper';
import CurriculumScraper from '@/scrapers/curriculumScraper';
import CurriculumComponentScraper from '@/scrapers/curriculumComponentScraper';
import DepartmentService from '@/services/departmentService';
import ComponentService from '@/services/componentService';
import { parseRequisites } from '@/utils/requisites';
import { COMPONENTS_LINK } from '@/constants';
import {
  Component,
  ComponentScraperOptions,
  ComponentType,
} from '@/models/componentModels';

class ComponentScraper implements BaseScraper {
  private programSigaaId?: number;
  private componentId?: string;
  private departmentService: DepartmentService;
  private componentService: ComponentService;

  constructor(options: ComponentScraperOptions) {
    const { programSigaaId, componentId } = options;

    this.programSigaaId = programSigaaId;
    this.componentId = componentId;
    this.departmentService = new DepartmentService();
    this.componentService = new ComponentService();
  }

  static async accessComponentsPage(): Promise<Page> {
    const page = await puppeteerSetup.newPage();
    await page.goto(COMPONENTS_LINK);

    return page;
  }

  static async accessComponentPage(componentId: string): Promise<Page> {
    const page = await puppeteerSetup.newPage();
    await page.goto(COMPONENTS_LINK);

    await page.select('#form\\:nivel', 'G');

    const inputRow = "//td[contains(text(), 'Código')]/ancestor::tr";
    const inputXpath = `::-p-xpath(${inputRow}//input[@type='text'])`;
    await page.$eval(inputXpath, (el) => ((el as HTMLInputElement).value = ''));
    await page.type(inputXpath, componentId);

    await page.locator('#form\\:btnBuscarComponentes').click();
    await page.waitForNavigation();

    const componentRow = `//td[contains(text(), '${componentId}')]/ancestor::tr`;
    const xpath = `::-p-xpath(${componentRow}//a[@title='Detalhes do Componente Curricular'])`;
    await page.locator(xpath).click();
    await page.waitForNavigation();

    return page;
  }

  static async extractData(componentPage: Page): Promise<Component> {
    const id = await this.extractAttribute(componentPage, 'Código');
    const title = await this.extractAttribute(componentPage, 'Nome');
    const type = await this.extractAttribute(componentPage, 'Tipo');
    const rawPre = await this.extractAttribute(componentPage, 'Pré-Requisitos');
    const rawCo = await this.extractAttribute(componentPage, 'Co-Requisitos');
    const rawEq = await this.extractAttribute(componentPage, 'Equivalências');
    const dptTitle = await this.extractAttribute(componentPage, 'Responsável');

    const department = await new DepartmentService().get({ title: dptTitle });

    const component = {
      id,
      title,
      type: this.parseComponentType(type),
      prerequisites: parseRequisites(rawPre),
      corequisites: parseRequisites(rawCo),
      equivalences: parseRequisites(rawEq),
      departmentId: department.sigaaId,
    };

    return component;
  }

  static async extractAttribute(page: Page, detail: string): Promise<string> {
    const xpath = `//th[contains(text(), "${detail}")]/following-sibling::td[1]`;

    return await page.$eval(
      `::-p-xpath(${xpath})`,
      (el) => (el as HTMLTableCellElement).innerText,
    );
  }

  static parseComponentType(type: string) {
    return (
      Object.values(ComponentType).find((t) => t === type) ||
      ComponentType.COURSE
    );
  }

  async scrape(): Promise<void> {
    if (this.programSigaaId) {
      await this.scrapeProgramComponents(this.programSigaaId);
    }

    if (this.componentId) {
      await this.scrapeSingleComponent(this.componentId);
    }
  }

  async scrapeProgramComponents(programSigaaId: number): Promise<void> {
    const page =
      await ProgramScraper.accessProgramCurriculaPage(programSigaaId);
    const ids = await CurriculumScraper.extractCurriculumSigaaIds(page);

    for (const curriculumSigaaId of ids) {
      await CurriculumScraper.accessCurriculumPage(page, curriculumSigaaId);
      const ids = await CurriculumComponentScraper.extractComponentIds(page);
      await this.componentService.saveIds(ids);

      for (const componentId of ids) {
        await CurriculumComponentScraper.accessComponentPage(page, componentId);
        const component = await ComponentScraper.extractData(page);
        await this.componentService.save(component);

        await page.goBack();
      }
    }
  }

  async scrapeSingleComponent(componentId: string): Promise<void> {
    const page = await ComponentScraper.accessComponentPage(componentId);
    const component = await ComponentScraper.extractData(page);
    await this.componentService.save(component);
  }
}

export default ComponentScraper;
