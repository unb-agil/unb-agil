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
    log(`Atualizando componente ${bold(component.title)}`);
    await axiosInstance.post('/components', component);
  }
}

export default ComponentService;
