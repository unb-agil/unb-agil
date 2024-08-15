import { Program } from '@/models/programModels';
import { Curriculum } from '@/models/curriculumModels';
import axiosInstance from '@/config/axiosConfig';

class CurriculumService {
  async saveSigaaIds(curriculumSigaaIds: Curriculum['sigaaId'][]) {
    console.log(`Updating ${curriculumSigaaIds.length} curriculum ids`);

    await axiosInstance.post('/curricula/sigaa-ids', curriculumSigaaIds);
  }

  async saveOrUpdate(curriculum: Curriculum): Promise<void> {
    console.log(`Updating curriculum ${curriculum.sigaaId}`);
    const sigaaId = encodeURIComponent(curriculum.sigaaId);

    await axiosInstance.put(`/curricula/${sigaaId}`, curriculum);
  }

  async getProgram(curriculumSigaaId: Curriculum['sigaaId']): Promise<Program> {
    console.log(`Getting program id for curriculum ${curriculumSigaaId}`);

    return {
      sigaaId: 414924,
      title: 'Mocked program',
      departmentId: 1,
    };
  }
}

export default CurriculumService;
