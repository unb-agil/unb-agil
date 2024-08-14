import { Program } from '@/models/programModels';

class ProgramService {
  async storeIds(programIds: Program['id'][]): Promise<void> {
    console.log(`Storing ${programIds.length} program ids`);
  }

  async update(program: Program) {
    console.log(`Updating program ${program.id} (${program.title})`);
  }
}

export default ProgramService;
