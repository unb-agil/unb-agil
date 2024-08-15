import { Request } from 'express';
import { AppDataSource } from '@/data-source';
import Department from '@/entity/Department';
import Component from '@/entity/Component';

class ComponentController {
  private repository = AppDataSource.getRepository(Component);
  private departmentRepository = AppDataSource.getRepository(Department);

  async saveSigaaIds(request: Request) {
    const sigaaIds = request.body;
    const components = sigaaIds.map((sigaaId) => ({ sigaaId }));
    return this.repository.save(components);
  }

  async saveOrUpdate(request: Request) {
    const { sigaaId } = request.params;
    const newComponent = request.body;

    const component =
      (await this.repository.findOneBy({ sigaaId })) || new Component();

    const department = await this.departmentRepository.findOneBy({
      sigaaId: newComponent.departmentSigaaId,
    });

    component.title = newComponent.title;
    component.type = newComponent.type;
    component.prerequisites = newComponent.prerequisites;
    component.corequisites = newComponent.corequisites;
    component.equivalences = newComponent.equivalences;
    component.department = department;

    return this.repository.save(component);
  }
}

export default ComponentController;
