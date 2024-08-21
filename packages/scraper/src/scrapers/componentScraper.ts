import chalk from 'chalk';
import { Page } from 'puppeteer';

import requisites from '@unb-agil/requisites-parser';

import puppeteerSetup from '@/config/puppeteer';
import BaseScraper from '@/scrapers/baseScraper';
import ProgramScraper from '@/scrapers/programScraper';
import CurriculumScraper from '@/scrapers/curriculumScraper';
import CurriculumComponentScraper from '@/scrapers/curriculumComponentScraper';
import DepartmentService from '@/services/departmentService';
import ComponentService from '@/services/componentService';
import { COMPONENTS_LINK } from '@/constants';
import {
  Component,
  ComponentScraperOptions,
  ComponentType,
} from '@/models/componentModels';

class ComponentScraper implements BaseScraper {
  private programSigaaId?: number;
  private componentSigaaId?: string;
  private departmentService: DepartmentService;
  private componentService: ComponentService;

  constructor(options: ComponentScraperOptions) {
    const { programSigaaId, componentSigaaId } = options;

    this.programSigaaId = programSigaaId;
    this.componentSigaaId = componentSigaaId;
    this.departmentService = new DepartmentService();
    this.componentService = new ComponentService();
  }

  static async accessComponentsPage(): Promise<Page> {
    const page = await puppeteerSetup.newPage();
    await page.goto(COMPONENTS_LINK);

    return page;
  }

  static async accessComponentPage(componentSigaaId: string): Promise<Page> {
    const page = await puppeteerSetup.newPage();
    await page.goto(COMPONENTS_LINK);

    await page.select('#form\\:nivel', 'G');

    const inputRow = "//td[contains(text(), 'Código')]/ancestor::tr";
    const inputXpath = `::-p-xpath(${inputRow}//input[@type='text'])`;
    await page.$eval(inputXpath, (el) => ((el as HTMLInputElement).value = ''));
    await page.type(inputXpath, componentSigaaId);

    await page.locator('#form\\:btnBuscarComponentes').click();
    await page.waitForNavigation();

    const componentRow = `//td[contains(text(), '${componentSigaaId}')]/ancestor::tr`;
    const xpath = `::-p-xpath(${componentRow}//a[@title='Detalhes do Componente Curricular'])`;
    await page.locator(xpath).click();
    await page.waitForNavigation();

    return page;
  }

  static async extractData(componentPage: Page): Promise<Component> {
    const sigaaId = await this.extractAttribute(componentPage, 'Código');
    const title = await this.extractAttribute(componentPage, 'Nome');
    const type = await this.extractAttribute(componentPage, 'Tipo');
    const rawPre = await this.extractAttribute(componentPage, 'Pré-Requisitos');
    const rawCo = await this.extractAttribute(componentPage, 'Co-Requisitos');
    const rawEq = await this.extractAttribute(componentPage, 'Equivalências');
    const departmentTitle = (
      await this.extractAttribute(componentPage, 'Responsável')
    ).split(' - ')[0];

    const department = await new DepartmentService().get({
      title: departmentTitle,
    });

    const component = {
      sigaaId,
      title,
      type: this.parseComponentType(type),
      prerequisites: requisites.parseRaw(rawPre),
      corequisites: requisites.parseRaw(rawCo),
      equivalences: requisites.parseRaw(rawEq),
      departmentSigaaId: department.sigaaId,
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
    switch (type) {
      case 'DISCIPLINA':
        return ComponentType.COURSE;
      case 'ATIVIDADE':
        return ComponentType.ACTIVITY;
      case 'BLOCO':
        return ComponentType.BLOCK;
      case 'MÓDULO':
        return ComponentType.MODULE;
      default:
        return ComponentType.COURSE;
    }
  }

  async scrape(): Promise<void> {
    console.log(chalk.bold.black.bgCyanBright('\nComponentes'));

    if (this.programSigaaId) {
      await this.scrapeProgramComponents(this.programSigaaId);
    }

    if (this.componentSigaaId) {
      await this.scrapeSingleComponent(this.componentSigaaId);
    }
  }

  async scrapeProgramComponents(programSigaaId: number): Promise<void> {
    const page =
      await ProgramScraper.accessProgramCurriculaPage(programSigaaId);
    const ids = await CurriculumScraper.extractCurriculumSigaaIds(page);

    for (const curriculumSigaaId of ids) {
      await CurriculumScraper.accessCurriculumPage(page, curriculumSigaaId);
      const ids =
        await CurriculumComponentScraper.extractComponentSigaaId(page);
      await this.componentService.saveSigaaIds(ids);

      for (const componentSigaaId of ids) {
        await CurriculumComponentScraper.accessComponentPage(
          page,
          componentSigaaId,
        );
        const component = await ComponentScraper.extractData(page);
        await this.componentService.saveOrUpdate(component);
        await page.goBack();
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      await page.goBack();
    }
  }

  async scrapeSingleComponent(componentSigaaId: string): Promise<void> {
    const page = await ComponentScraper.accessComponentPage(componentSigaaId);
    const component = await ComponentScraper.extractData(page);
    await this.componentService.saveOrUpdate(component);
  }
}

export default ComponentScraper;
