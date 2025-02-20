import { Request } from 'express';
import { AppDataSource } from '#data-source.js';
import CurriculumController from './CurriculumController';

jest.mock('#data-source.js');

describe('CurriculumController', () => {
  let curriculumController: CurriculumController;
  let mockRequest: Partial<Request>;
  let mockRepository: any;
  let mockProgramRepository: any;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    mockProgramRepository = {
      findOneBy: jest.fn(),
    };
    curriculumController = new CurriculumController();
    curriculumController['repository'] = mockRepository;
    AppDataSource.getRepository = jest.fn().mockReturnValue(mockProgramRepository);
    mockRequest = {};
  });

  describe('saveSigaaIds', () => {
    it('should save curricula with given sigaaIds', async () => {
      const sigaaIds = [1, 2, 3];
      mockRequest.body = sigaaIds;
      mockRepository.save.mockResolvedValue(sigaaIds.map(sigaaId => ({ sigaaId })));

      const result = await curriculumController.saveSigaaIds(mockRequest as Request);

      expect(mockRepository.save).toHaveBeenCalledWith(sigaaIds.map(sigaaId => ({ sigaaId })));
      expect(result).toEqual(sigaaIds.map(sigaaId => ({ sigaaId })));
    });
  });

  describe('get', () => {
    it('should get a curriculum by sigaaId', async () => {
      const sigaaId = '1';
      const curriculum = { sigaaId, isActive: true };
      mockRequest.query = { sigaaId };
      mockRepository.findOneBy.mockResolvedValue(curriculum);

      const result = await curriculumController.get(mockRequest as Request);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ sigaaId });
      expect(result).toEqual(curriculum);
    });
  });
});