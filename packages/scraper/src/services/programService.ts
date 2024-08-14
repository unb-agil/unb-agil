import axiosInstance from '@/config/axiosConfig';
import { Program } from '@/models/programModels';

class ProgramService {
  async saveSigaaIds(programSigaaIds: Program['sigaaId'][]): Promise<void> {
    console.log(`Storing ${programSigaaIds.length} program ids`);

    await axiosInstance.post('/programs/sigaa-ids', programSigaaIds);
  }

  async saveOrUpdate(program: Program) {
    console.log(`Updating program ${program.sigaaId} (${program.title})`);

    await axiosInstance.put(`/programs/${program.sigaaId}`, program);
  }
}

export default ProgramService;
