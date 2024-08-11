import { CurriculumComponent } from '@/models/curriculumComponentModels';

class CurriculumComponentService {
  public async createCurriculumComponent(
    curriculumComponent: CurriculumComponent,
  ): Promise<void> {
    const { curriculumId, componentId } = curriculumComponent;
    console.log(
      `Creating curriculum component ${componentId} for curriculum ${curriculumId}`,
    );
  }
}

export default CurriculumComponentService;
