import axiosInstance from '@/config/axiosConfig';
import { Component } from '@/models/componentModels';

class ComponentService {
  async saveSigaaIds(componentSigaaIds: string[]): Promise<void> {
    console.log(`Updating ${componentSigaaIds.length} component ids`);

    await axiosInstance.post('/components/sigaa-ids', componentSigaaIds);
  }

  async saveOrUpdate(component: Component): Promise<void> {
    console.log(`Updating component ${component.sigaaId} (${component.title})`);

    await axiosInstance.post('/components', {
      ...component,
      prerequisites: JSON.stringify(component.prerequisites),
      corequisites: JSON.stringify(component.corequisites),
      equivalences: JSON.stringify(component.equivalences),
    });
  }
}

export default ComponentService;
