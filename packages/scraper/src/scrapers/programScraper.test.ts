import { Page } from 'puppeteer';
import ProgramScraper from '#scrapers/programScraper';
import ProgramService from '#services/programService';
import DepartmentService from '#services/departmentService';
import puppeteerSetup from '#config/puppeteer.js';

jest.mock('#services/programService');
jest.mock('#services/departmentService');
jest.mock('#config/puppeteer.js');

describe('ProgramScraper', () => {
  let programScraper: ProgramScraper;
  let mockPage: Partial<Page>;

  beforeEach(() => {
    mockPage = {
      goto: jest.fn(),
      $$eval: jest.fn(),
      $eval: jest.fn(),
      close: jest.fn(),
    };

    ProgramService.prototype.saveSigaaIds = jest.fn();
    ProgramService.prototype.saveOrUpdate = jest.fn();
    DepartmentService.prototype.get = jest.fn().mockResolvedValue({ sigaaId: 123 });

    puppeteerSetup.newPage = jest.fn().mockResolvedValue(mockPage);

    programScraper = new ProgramScraper({ programSigaaId: 123 });
  });

  describe('Static methods', () => {
    it('should generate correct ProgramPresentationUrl', () => {
      const url = ProgramScraper.getProgramPresentationUrl(123);
      expect(url).toBe('https://sigaa.unb.br/sigaa/public/curso/portal.jsf?lc=pt_BR&id=123');
    });

    it('should generate correct ProgramCurriculaUrl', () => {
      const url = ProgramScraper.getProgramCurriculaUrl(123);
      expect(url).toBe('https://sigaa.unb.br/sigaa/public/curso/curriculo.jsf?lc=pt_BR&id=123');
    });

    it('should extract programSigaaIds from the page', async () => {
      (mockPage.$$eval as jest.Mock).mockResolvedValue([123, 456]);
      const sigaaIds = await ProgramScraper.extractProgramSigaaIds(mockPage as Page);
      expect(sigaaIds).toEqual([123, 456]);
    });

    it('should extract program data correctly', async () => {
      (mockPage.$eval as jest.Mock)
        .mockResolvedValueOnce('CURSO DE Teste / Engenharia')
        .mockResolvedValueOnce('Departamento de Teste');

      const data = await ProgramScraper.extractProgramData(mockPage as Page);

      expect(data).toEqual({
        title: 'Teste',
        departmentSigaaId: 123,
      });
    });
  });

  describe('Scraping process', () => {
    it('should scrape program Sigaa IDs and save them', async () => {
      const programSigaaIds = [123, 456];
      (mockPage.$$eval as jest.Mock).mockResolvedValue(programSigaaIds);

      await programScraper.scrapeProgramSigaaIds();

      expect(programScraper['programSigaaIds']).toEqual(programSigaaIds);
      expect(ProgramService.prototype.saveSigaaIds).toHaveBeenCalledWith(programSigaaIds);
    });

    // it('should scrape program data for each programSigaaId', async () => {
    //   const programSigaaIds = [123, 456];
    //   (programScraper as any).programSigaaIds = programSigaaIds;

    //   const programData = { title: 'Curso de Teste', departmentSigaaId: 123 };
    //   (mockPage.$$eval as jest.Mock).mockResolvedValue(programSigaaIds);
    //   (mockPage.$eval as jest.Mock)
    //     .mockResolvedValueOnce('CURSO DE Teste / Engenharia')
    //     .mockResolvedValueOnce('Departamento de Teste');
    //   (mockPage.goto as jest.Mock).mockResolvedValue(undefined);
    //   (ProgramService.prototype.saveOrUpdate as jest.Mock).mockResolvedValue(undefined);

    //   await programScraper.scrapeProgramsData();

    //   expect(ProgramService.prototype.saveOrUpdate).toHaveBeenCalledTimes(2);
    // });

    it('should scrape a single program data', async () => {
      const programSigaaId = 123;
      (mockPage.goto as jest.Mock).mockResolvedValue(undefined);

      (mockPage.$eval as jest.Mock)
        .mockResolvedValueOnce('CURSO DE Teste / Engenharia')
        .mockResolvedValueOnce('Departamento de Teste');

      await programScraper.scrapeProgramData(programSigaaId);

      expect(ProgramService.prototype.saveOrUpdate).toHaveBeenCalledWith({
        sigaaId: programSigaaId,
        title: 'Teste',
        departmentSigaaId: 123,
      });
    });
  });
});
