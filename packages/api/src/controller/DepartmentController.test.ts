import { Request } from 'express';
import { AppDataSource } from '#data-source.js';
import Department from '#entity/Department';
import DepartmentController from './DepartmentController';

jest.mock('#data-source.js');

describe('DepartmentController', () => {
  let departmentController: DepartmentController;
  let mockRequest: Partial<Request>;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    departmentController = new DepartmentController();
    departmentController['repository'] = mockRepository;
    mockRequest = {};
  });

  describe('saveId', () => {
    it('should save departments with given ids', async () => {
      const ids = [1, 2, 3];
      mockRequest.body = ids;
      mockRepository.save.mockResolvedValue(ids.map(id => ({ sigaaId: id, acronym: '', title: '', programs: [], components: [] })));

      const result = await departmentController.saveId(mockRequest as Request);

      expect(mockRepository.save).toHaveBeenCalledWith(ids.map(id => ({ sigaaId: id })));
      expect(result).toEqual(ids.map(id => ({ sigaaId: id, acronym: '', title: '', programs: [], components: [] })));
    });
  });

  describe('saveOrUpdate', () => {
    it('should update an existing department', async () => {
      const sigaaId = 1;
      const acronym = 'CS';
      const title = 'Computer Science';
      mockRequest.params = { sigaaId: sigaaId.toString() };
      mockRequest.body = { acronym, title };
      const existingDepartment = { sigaaId, acronym: 'Old', title: 'Old Title', programs: [], components: [] };
      mockRepository.findOneBy.mockResolvedValue(existingDepartment);
      mockRepository.save.mockResolvedValue(existingDepartment);

      const result = await departmentController.saveOrUpdate(mockRequest as Request);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ sigaaId });
      expect(mockRepository.save).toHaveBeenCalledWith({ ...existingDepartment, acronym, title });
      expect(result).toEqual({ ...existingDepartment, acronym, title });
    });

    it('should create a new department if not found', async () => {
      const sigaaId = 2;
      const acronym = 'EE';
      const title = 'Electrical Engineering';
      mockRequest.params = { sigaaId: sigaaId.toString() };
      mockRequest.body = { acronym, title };
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.save.mockResolvedValue({ sigaaId, acronym, title, programs: [], components: [] });

      const result = await departmentController.saveOrUpdate(mockRequest as Request);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ sigaaId });
      expect(mockRepository.save).toHaveBeenCalledWith({ sigaaId, acronym, title });
      expect(result).toEqual({ sigaaId, acronym, title, programs: [], components: [] });
    });
  });

  describe('get', () => {
    it('should get a department by sigaaId', async () => {
      const sigaaId = 1;
      mockRequest.query = { sigaaId: sigaaId.toString() };
      const department = { sigaaId, acronym: 'CS', title: 'Computer Science' };
      mockRepository.findOneBy.mockResolvedValue(department);

      const result = await departmentController.get(mockRequest as Request);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ sigaaId });
      expect(result).toEqual(department);
    });

    it('should get a department by title', async () => {
      const title = 'Computer Science';
      mockRequest.query = { title };
      const department = { sigaaId: 1, acronym: 'CS', title };
      mockRepository.findOneBy.mockResolvedValue(department);

      const result = await departmentController.get(mockRequest as Request);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ title });
      expect(result).toEqual(department);
    });

    it('should get a department by acronym', async () => {
      const acronym = 'CS';
      mockRequest.query = { acronym };
      const department = { sigaaId: 1, acronym, title: 'Computer Science' };
      mockRepository.findOneBy.mockResolvedValue(department);

      const result = await departmentController.get(mockRequest as Request);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ acronym });
      expect(result).toEqual(department);
    });
  });
});
