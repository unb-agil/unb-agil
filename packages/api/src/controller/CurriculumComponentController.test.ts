import { Request } from 'express';
import { AppDataSource } from '#data-source.js';
import Curriculum from '#entity/Curriculum.js';
import Component from '#entity/Component.js';
import CurriculumComponent from '#entity/CurriculumComponent.js';
import CurriculumComponentController from './CurriculumComponentController';

jest.mock('#data-source.js', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('CurriculumComponentController', () => {
  let curriculumComponentController: CurriculumComponentController;

  beforeEach(() => {
    const curriculumRepository = {
      findOneBy: jest.fn().mockResolvedValue({ sigaaId: '123' }),
    };

    const componentRepository = {
      findOneBy: jest.fn().mockResolvedValue({ sigaaId: '456' }),
    };

    const curriculumComponentRepository = {
      findOneBy: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(true),
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          { component: { sigaaId: '456', title: 'Matéria Teste' } },
        ]),
      })),
    };

    (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
      if (entity === Curriculum) return curriculumRepository;
      if (entity === Component) return componentRepository;
      if (entity === CurriculumComponent) return curriculumComponentRepository;
    });

    curriculumComponentController = new CurriculumComponentController();
    (curriculumComponentController as any).curriculumRepository = curriculumRepository;
    (curriculumComponentController as any).componentRepository = componentRepository;
    (curriculumComponentController as any).curriculumComponentRepository = curriculumComponentRepository;
  });

  it('should save or update curriculum components', async () => {
    const mockRequest = {
      body: [
        {
          curriculumSigaaId: '123',
          componentSigaaId: '456',
          type: 'Obrigatório',
          recommendedPeriod: 2,
        },
      ],
    } as Request;

    const result = await curriculumComponentController.batchSaveOrUpdate(mockRequest as Request<never, CurriculumComponent[]>);
    expect(result).toBe(true);
  });

  it('should search curriculum components', async () => {
    const mockRequest = {
      query: { curriculumSigaaId: '123' },
    } as unknown as Request;

    const result = await curriculumComponentController.search(mockRequest);
    expect(result).toEqual([{ sigaaId: '456', title: 'Matéria Teste' }]);
  });
});
