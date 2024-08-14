import { Program } from '@/models/programModels';
import { Curriculum } from '@/models/curriculumModels';

class CurriculumService {
  async storeIds(programId: Program['id'], curriculumIds: Curriculum['id'][]) {
    console.log(`Storing ${curriculumIds.length} curriculum ids`);
  }

  async update(curriculum: Curriculum): Promise<void> {
    console.log(`Updating curriculum ${curriculum.id}`);
  }

  async getProgramId(curriculumId: Curriculum['id']): Promise<number> {
    console.log(`Getting program id for curriculum ${curriculumId}`);
    return 414924;
  }
}

export default CurriculumService;
