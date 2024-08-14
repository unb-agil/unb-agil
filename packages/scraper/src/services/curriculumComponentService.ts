import { CurriculumComponent } from '@/models/curriculumComponentModels';

class CurriculumComponentService {
  async batchUpdate(curriculumComponent: CurriculumComponent[]): Promise<void> {
    console.log(`Updating ${curriculumComponent.length} curriculum components`);
  }
}

export default CurriculumComponentService;
