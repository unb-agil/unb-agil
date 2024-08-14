import { Program } from '@/models/programModels';
import { Curriculum } from '@/models/curriculumModels';

class CurriculumService {
  async storeIds(
    programSigaaId: Program['sigaaId'],
    curriculumSigaaIds: Curriculum['sigaaId'][],
  ) {
    console.log(`Updating ${curriculumSigaaIds.length} curriculum ids`);
  }

  async update(curriculum: Curriculum): Promise<void> {
    console.log(`Updating curriculum ${curriculum.sigaaId}`);
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
