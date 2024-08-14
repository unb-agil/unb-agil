import { Program } from '@/models/programModels';
import { Curriculum } from '@/models/curriculumModels';

class CurriculumService {
  async storeIds(
    programSigaaId: Program['sigaaId'],
    curriculumIds: Curriculum['id'][],
  ) {
    console.log(`Updating ${curriculumIds.length} curriculum ids`);
  }

  async update(curriculum: Curriculum): Promise<void> {
    console.log(`Updating curriculum ${curriculum.id}`);
  }

  async getProgram(curriculumId: Curriculum['id']): Promise<Program> {
    console.log(`Getting program id for curriculum ${curriculumId}`);

    return {
      sigaaId: 414924,
      title: 'Mocked program',
      departmentId: 1,
    };
  }
}

export default CurriculumService;
