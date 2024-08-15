import chalk from 'chalk';
import { Program } from '@/models/programModels';
import { Curriculum } from '@/models/curriculumModels';
import axiosInstance from '@/config/axiosConfig';

const log = (message: string) => console.log(chalk.blueBright(message));
const bold = (message: string | number) => chalk.bold(message);

class CurriculumService {
  async saveSigaaIds(curriculumSigaaIds: Curriculum['sigaaId'][]) {
    log(`Salvando ${bold(curriculumSigaaIds.length)} IDs de currículos.`);
    await axiosInstance.post('/curricula/sigaa-ids', curriculumSigaaIds);
  }

  async saveOrUpdate(curriculum: Curriculum): Promise<void> {
    log(`Atualizando currículo ${bold(curriculum.sigaaId)}`);
    const sigaaId = encodeURIComponent(curriculum.sigaaId);
    await axiosInstance.put(`/curricula/${sigaaId}`, curriculum);
  }

  async getProgram(curriculumSigaaId: Curriculum['sigaaId']) {
    const sigaaId = encodeURIComponent(curriculumSigaaId);
    const url = `/curricula/${sigaaId}/program`;
    const { data } = await axiosInstance.get<Program>(url);
    return data;
  }
}

export default CurriculumService;
