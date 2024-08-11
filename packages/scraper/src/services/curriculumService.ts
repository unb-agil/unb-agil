import { CurriculumDetails } from '@/models/curriculumModels';

class CurriculumService {
  async storeCurriculumIds(
    programId: number,
    curriculumIds: string[],
  ): Promise<void> {
    console.log(
      `Storing curriculum ids for program ${programId}: ${curriculumIds.join(', ')}`,
    );
  }

  async getAllCurriculumIdsByProgramId(programId: number): Promise<string[]> {
    return ['6360/2', '6360/1', '6360/-2'];
  }

  async storeCurriculumDetails(details: CurriculumDetails): Promise<void> {
    console.log('Storing curriculum details:', details);
  }

  async getProgramId(curriculumId: string): Promise<number> {
    return 414924;
  }
}

export default CurriculumService;
