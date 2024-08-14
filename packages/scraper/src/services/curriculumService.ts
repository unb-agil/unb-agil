import { Program } from '@/models/programModels';
import { Curriculum } from '@/models/curriculumModels';

class CurriculumService {
  async storeIds(programId: Program['id'], curriculumIds: Curriculum['id'][]) {
    console.log(`Storing ${curriculumIds.length} curriculum ids`);
  }

  async update(curriculum: Curriculum): Promise<void> {
    console.log(`Updating curriculum ${curriculum.id}`);
  }

  async getProgram(curriculumId: Curriculum['id']): Promise<Program> {
    console.log(`Getting program id for curriculum ${curriculumId}`);

    return {
      id: 414924,
      title: 'Mocked program',
      departmentId: 1,
    };
  }
}

export default CurriculumService;
