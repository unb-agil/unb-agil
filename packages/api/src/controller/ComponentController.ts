import { Request } from 'express';
import { AppDataSource } from '#data-source.js';
import Component from '#entity/Component.js';

class ComponentController {
  private repository = AppDataSource.getRepository(Component);

  async saveSigaaIds(request: Request) {
    const sigaaIds = request.body;
    const components = sigaaIds.map((sigaaId) => ({ sigaaId }));
    return this.repository.save(components);
  }

  async saveOrUpdate(request: Request) {
    const component = request.body;
    return this.repository.save(component);
  }
}

export default ComponentController;
