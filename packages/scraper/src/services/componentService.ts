import { Component } from '@/models/componentModels';

class ComponentService {
  async saveIds(componentIds: string[]): Promise<void> {
    console.log(`Updating ${componentIds.length} component ids`);
  }

  async save(component: Component): Promise<void> {
    console.log(`Updating component ${component.id} (${component.title})`);
  }
}

export default ComponentService;
