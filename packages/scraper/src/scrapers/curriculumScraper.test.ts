import { Page } from 'puppeteer';
import CurriculumScraper from '#scrapers/curriculumScraper.js';
import CurriculumService from '#services/curriculumService.js';
import { Program } from '#models/programModels.js';
import { CurriculumScraperOptions } from '#models/curriculumModels.js';

jest.mock('#services/curriculumService.js');
jest.mock('#scrapers/programScraper.js');

describe('CurriculumScraper', () => {
  let scraper: CurriculumScraper;
  let mockPage: Page;

  beforeEach(() => {
    const options: CurriculumScraperOptions = {
      programSigaaId: 123,
      curriculumSigaaIds: ['test-curriculum-id'],
    };
    scraper = new CurriculumScraper(options);

    mockPage = {
      locator: jest.fn().mockImplementation(() => {
        const locatorMock = {
          click: jest.fn(),
          waitForNavigation: jest.fn(),
        };
        return Object.assign(locatorMock, { mock: { results: [{ value: locatorMock }] } });
      }),
      $$eval: jest.fn(),
      $eval: jest.fn(),
      goBack: jest.fn(),
      close: jest.fn(),
    } as unknown as Page;
  });

  it('should initialize with given options', () => {
    expect(scraper).toBeDefined();
    expect(scraper['programSigaaId']).toBe(123);
    expect(scraper['curriculumSigaaIds']).toEqual(['test-curriculum-id']);
  });

  // it('should access curriculum page', async () => {
  //   await CurriculumScraper.accessCurriculumPage(mockPage, 'test-curriculum-id');
  //   expect(mockPage.locator).toHaveBeenCalledWith('::-p-xpath(//td[contains(text(), "test-curriculum-id")]/ancestor::tr//a[contains(@title, "Relatório")])');
  //   const locatorReturn = (mockPage.locator as jest.Mock).mock.results[0].value;
  //   expect(locatorReturn.click).toHaveBeenCalled();
  //   expect(locatorReturn.waitForNavigation).toHaveBeenCalled();
  // });

  it('should extract curriculum sigaa ids', async () => {
    mockPage.$$eval = jest.fn().mockResolvedValue(['Detalhes da Estrutura Curricular 123,']);
    const ids = await CurriculumScraper.extractCurriculumSigaaIds(mockPage);
    expect(ids).toEqual(['123']);
  });

  it('should extract curriculum data', async () => {
    CurriculumScraper.extractAttribute = jest.fn().mockResolvedValue('10');
    const data = await CurriculumScraper.extractCurriculumData(mockPage, 123);
    expect(data).toEqual({
      startPeriod: '10',
      minPeriods: 10,
      maxPeriods: 10,
      minPeriodWorkload: 10,
      maxPeriodWorkload: 10,
      programSigaaId: 123,
    });
  });

  it('should scrape curriculum data', async () => {
    scraper['scrapeCurriculumData'] = jest.fn();
    await scraper.scrapeCurriculaData();
    expect(scraper['scrapeCurriculumData']).toHaveBeenCalled();
  });

  // it('should scrape curriculum sigaa ids', async () => {
  //   scraper['scrapeCurriculumSigaaIds'] = jest.fn().mockResolvedValue(['123']);
  //   await scraper.scrape();
  //   expect(scraper['scrapeCurriculumSigaaIds']).toHaveBeenCalled();
  // });
});
