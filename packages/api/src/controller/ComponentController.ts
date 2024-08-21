import { Request } from 'express';
import { AppDataSource } from '@/data-source';

import requisites from '@unb-agil/requisites-parser';

import Component from '@/entity/Component';

class ComponentController {
  private repository = AppDataSource.getRepository(Component);

  async saveSigaaIds(request: Request) {
    const sigaaIds = request.body;
    const components = sigaaIds.map((sigaaId) => ({ sigaaId }));
    return this.repository.save(components);
  }

  async saveOrUpdate(request: Request) {
    const component = request.body;

    const formattedComponent = {
      ...component,
      prerequisites: requisites.stringify(component.prerequisites),
      corequisites: requisites.stringify(component.corequisites),
      equivalences: requisites.stringify(component.equivalences),
    };

    return this.repository.save(formattedComponent);
  }
}

export default ComponentController;
