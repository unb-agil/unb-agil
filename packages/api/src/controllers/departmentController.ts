import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Department } from '@/entities/departmentEntity';

export class DepartmentController {
  static getAll = async (req: Request, res: Response) => {
    const departmentRepository = getRepository(Department);
    const departments = await departmentRepository.find();
    res.json(departments);
  };

  static create = async (req: Request, res: Response) => {
    const departmentRepository = getRepository(Department);
    const department = departmentRepository.create(req.body);
    const result = await departmentRepository.save(department);
    res.send(result);
  };
}
