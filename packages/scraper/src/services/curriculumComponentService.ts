import chalk from 'chalk';
import axiosInstance from '@/config/axiosConfig';
import { CurriculumComponent } from '@/models/curriculumComponentModels';

const log = (message: string) => console.log(chalk.magentaBright(message));
const bold = (message: string | number) => chalk.bold(message);

class CurriculumComponentService {
  async batchUpdate(curriculumComponent: CurriculumComponent[]): Promise<void> {
    log(
      `Atualizando ${bold(curriculumComponent.length)} componentes curriculares`,
    );
    await axiosInstance.post('/curricula-components', curriculumComponent);
  }
}

export default CurriculumComponentService;
