import chalk from 'chalk';
import axiosInstance from '@/config/axiosConfig';
import { Component } from '@/models/componentModels';

const log = (message: string) => console.log(chalk.cyanBright(message));
const bold = (message: string | number) => chalk.bold(message);

class ComponentService {
  async saveSigaaIds(componentSigaaIds: string[]): Promise<void> {
    log(`Salvando ${bold(componentSigaaIds.length)} IDs de componentes.`);
    await axiosInstance.post('/components/sigaa-ids', componentSigaaIds);
  }

  async saveOrUpdate(component: Component): Promise<void> {
    log(`Atualizando componente ${bold(component.sigaaId)}`);

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
