import chalk from 'chalk';
import axiosInstance from '@/config/axiosConfig';
import { Program } from '@/models/programModels';

const log = (message: string) => console.log(chalk.yellowBright(message));
const bold = (message: string | number) => chalk.bold(message);

class ProgramService {
  async saveSigaaIds(programSigaaIds: Program['sigaaId'][]): Promise<void> {
    log(`Salvanado ${bold(programSigaaIds.length)} IDs de cursos.`);
    await axiosInstance.post('/programs/sigaa-ids', programSigaaIds);
  }

  async saveOrUpdate(program: Program) {
    log(`Atualizando curso ${bold(program.title)}`);
    await axiosInstance.put(`/programs/${program.sigaaId}`, program);
  }
}

export default ProgramService;
