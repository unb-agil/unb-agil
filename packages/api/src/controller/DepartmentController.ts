import { Request } from 'express';
import { AppDataSource } from '@/data-source';
import Department from '@/entity/Department';

class DepartmentController {
  private repository = AppDataSource.getRepository(Department);

  async saveId(request: Request) {
    const ids = request.body;
    const departments = ids.map((id) => ({ sigaaId: id }));
    return this.repository.save(departments);
  }

  async saveOrUpdate(request: Request) {
    const sigaaId = Number(request.params.sigaaId);
    const { acronym, title } = request.body;

    const department =
      (await this.repository.findOneBy({ sigaaId })) || new Department();

    department.sigaaId = sigaaId;
    department.acronym = acronym;
    department.title = title;

    return this.repository.save(department);
  }
}

export default DepartmentController;
