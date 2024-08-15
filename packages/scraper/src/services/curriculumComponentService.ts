import axiosInstance from '@/config/axiosConfig';
import { CurriculumComponent } from '@/models/curriculumComponentModels';

class CurriculumComponentService {
  async batchUpdate(curriculumComponent: CurriculumComponent[]): Promise<void> {
    console.log(`Updating ${curriculumComponent.length} curriculum components`);

    await axiosInstance.post('/curricula-components', curriculumComponent);
  }
}

export default CurriculumComponentService;
