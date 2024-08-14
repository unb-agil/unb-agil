import { Request } from 'express';
import { AppDataSource } from '@/data-source';
import Program from '@/entity/Program';
import Department from '@/entity/Department';

class ProgramController {
  private repository = AppDataSource.getRepository(Program);

  async saveSigaaIds(request: Request) {
    const sigaaIds = request.body;
    const programs = sigaaIds.map((sigaaId) => ({ sigaaId }));
    return this.repository.save(programs);
  }

  async saveOrUpdate(request: Request) {
    const sigaaId = Number(request.params.sigaaId);
    const { title, shift, departmentSigaaId } = request.body;

    const program =
      (await this.repository.findOneBy({ sigaaId })) || new Program();

    const department = await AppDataSource.getRepository(Department).findOneBy({
      sigaaId: departmentSigaaId,
    });

    program.sigaaId = sigaaId;
    program.title = title;
    program.shift = shift;
    program.department = department;

    return this.repository.save(program);
  }
}

export default ProgramController;
