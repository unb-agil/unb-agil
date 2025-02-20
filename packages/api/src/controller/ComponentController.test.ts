import { Request } from 'express';
import { AppDataSource } from '#data-source.js';
import Component from '#entity/Component.js';
import ComponentController from './ComponentController';

jest.mock('#data-source.js');

describe('ComponentController', () => {
  let componentController: ComponentController;
  let mockRequest: Partial<Request>;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    
    componentController = new ComponentController();
    componentController['repository'] = mockRepository;
    AppDataSource.getRepository = jest.fn().mockReturnValue(mockRepository);
    
    mockRequest = {};
  });

  describe('saveSigaaIds', () => {
    it('should save components with given sigaaIds', async () => {
      const sigaaIds = [1, 2, 3];
      mockRequest.body = sigaaIds;
      mockRepository.save.mockResolvedValue(sigaaIds.map(sigaaId => ({ sigaaId })));

      const result = await componentController.saveSigaaIds(mockRequest as Request);

      expect(mockRepository.save).toHaveBeenCalledWith(sigaaIds.map(sigaaId => ({ sigaaId })));
      expect(result).toEqual(sigaaIds.map(sigaaId => ({ sigaaId })));
    });
  });

  describe('saveOrUpdate', () => {
    it('should save or update a component', async () => {
      const component = {
        sigaaId: '10',
        name: 'Test Component',
        workload: 60,
      };
      mockRequest.body = component;
      mockRepository.save.mockResolvedValue(component);

      const result = await componentController.saveOrUpdate(mockRequest as Request);

      expect(mockRepository.save).toHaveBeenCalledWith(component);
      expect(result).toEqual(component);
    });
  });
});
