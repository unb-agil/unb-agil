import axiosInstance from '@/config/axiosConfig';
import { Component } from '@/models/componentModels';

class ComponentService {
  async saveSigaaIds(componentSigaaIds: string[]): Promise<void> {
    console.log(`Updating ${componentSigaaIds.length} component ids`);

    await axiosInstance.post('/components/sigaa-ids', componentSigaaIds);
  }

  async saveOrUpdate(component: Component): Promise<void> {
    console.log(`Updating component ${component.sigaaId} (${component.title})`);

    const prerequisites =
      typeof component.prerequisites === 'string' || !component.prerequisites
        ? component.prerequisites
        : JSON.stringify(component.prerequisites);

    const corequisites =
      typeof component.corequisites === 'string' || !component.corequisites
        ? component.corequisites
        : JSON.stringify(component.corequisites);

    const equivalences =
      typeof component.equivalences === 'string' || !component.equivalences
        ? component.equivalences
        : JSON.stringify(component.equivalences);

    await axiosInstance.post('/components', {
      ...component,
      prerequisites,
      corequisites,
      equivalences,
    });
  }
}

export default ComponentService;
