import { Page } from 'puppeteer';

import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import DepartmentService from '@/services/departmentService';
import ComponentService from '@/services/componentService';
import { parseRequisites } from '@/utils/requisites';
import {
  Component,
  ComponentDetails,
  ComponentScraperOptions,
  ComponentType,
} from '@/models/componentModels';
import { COMPONENTS_LINK } from '@/constants';

class ComponentScraper implements BaseScraper {
  private componentIds: string[];
  private departmentService: DepartmentService;
  private componentService: ComponentService;

  constructor(options: ComponentScraperOptions) {
    const { componentIds } = options;

    this.componentIds = componentIds;
    this.departmentService = new DepartmentService();
    this.componentService = new ComponentService();
  }

  static async accessComponentsPage(): Promise<Page> {
    const page = await puppeteerSetup.newPage();
    await page.goto(COMPONENTS_LINK);

    return page;
  }

  async scrape(): Promise<void> {
    await this.scrapeAllComponentDetails();
  }

  async scrapeAllComponentDetails(): Promise<void> {
    for (const componentId of this.componentIds) {
      await this.scrapeComponentDetails(componentId);
    }
  }

  async scrapeComponentDetails(componentId: string): Promise<void> {
    const page = await this.goToComponentPage(componentId);
    const details = await this.extractAttributes(page);
    const component = await this.formatComponent(componentId, details);
    await this.componentService.storeComponent(component);
  }

  async goToComponentPage(componentId: string): Promise<Page> {
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

  private async extractAttributes(page: Page): Promise<ComponentDetails> {
    const title = await this.extractAttribute(page, 'Nome');
    const type = await this.extractAttribute(page, 'Tipo do Componente');
    const department = await this.extractAttribute(page, 'Responsável');
    const prerequisites = await this.extractAttribute(page, 'Pré-Requisitos');
    const corequisites = await this.extractAttribute(page, 'Co-Requisitos');
    const equivalences = await this.extractAttribute(page, 'Equivalências');

    return {
      title,
      type,
      department,
      prerequisites,
      corequisites,
      equivalences,
    };
  }

  private async extractAttribute(page: Page, detail: string): Promise<string> {
    const xpath = `//th[contains(text(), "${detail}")]/following-sibling::td[1]`;

    return await page.$eval(
      `::-p-xpath(${xpath})`,
      (el) => (el as HTMLTableCellElement).innerText,
    );
  }

  private async formatComponent(
    componentId: string,
    details: ComponentDetails,
  ): Promise<Component> {
    return {
      id: componentId,
      title: details.title,
      type: this.getComponentType(details.type),
      departmentId: await this.getDepartmentId(details.department),
      prerequisites: parseRequisites(details.prerequisites),
      corequisites: parseRequisites(details.corequisites),
      equivalences: parseRequisites(details.equivalences),
    };
  }

  private getComponentType(type: string) {
    return (
      Object.values(ComponentType).find((t) => t === type) ||
      ComponentType.COURSE
    );
  }

  private async getDepartmentId(title: string) {
    const department = await this.departmentService.get({ title });

    return department.id;
  }
}

export default ComponentScraper;
