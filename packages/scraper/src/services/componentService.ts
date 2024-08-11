import { Component } from '@/models/componentModels';

class ComponentService {
  async storeComponent(component: Component): Promise<void> {
    console.log(`Storing component: ${component.id} - ${component.title}`);
  }
}

export default ComponentService;
