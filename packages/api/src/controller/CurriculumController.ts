import { Request } from 'express';
import { AppDataSource } from '@/data-source';
import Program from '@/entity/Program';
import Curriculum from '@/entity/Curriculum';

class CurriculumController {
  private repository = AppDataSource.getRepository(Curriculum);

  async saveSigaaIds(request: Request) {
    const sigaaIds = request.body;
    const curricula = sigaaIds.map((sigaaId) => ({ sigaaId }));
    return this.repository.save(curricula);
  }

  async saveOrUpdate(request: Request) {
    const sigaaId = decodeURIComponent(request.params.sigaaId);
    const newCurriculum = request.body;

    const curriculum =
      (await this.repository.findOneBy({ sigaaId })) || new Curriculum();

    const program = await AppDataSource.getRepository(Program).findOneBy({
      sigaaId: newCurriculum.programSigaaId,
    });

    curriculum.sigaaId = sigaaId;
    curriculum.isActive = newCurriculum.isActive;
    curriculum.startYear = newCurriculum.startYear;
    curriculum.startPeriod = newCurriculum.startPeriod;
    curriculum.minPeriods = newCurriculum.minPeriods;
    curriculum.maxPeriods = newCurriculum.maxPeriods;
    curriculum.minPeriodWorkload = newCurriculum.minPeriodWorkload;
    curriculum.maxPeriodWorkload = newCurriculum.maxPeriodWorkload;
    curriculum.minWorkload = newCurriculum.minWorkload;
    curriculum.mandatoryComponentsWorkload =
      newCurriculum.mandatoryComponentsWorkload;
    curriculum.minElectiveComponentsWorkload =
      newCurriculum.minElectiveComponentsWorkload;
    curriculum.maxElectiveComponentsWorkload =
      newCurriculum.maxElectiveComponentsWorkload;
    curriculum.minComplementaryComponentsWorkload =
      newCurriculum.minComplementaryComponentsWorkload;
    curriculum.maxComplementaryComponentsWorkload =
      newCurriculum.maxComplementaryComponentsWorkload;
    curriculum.program = program;

    return this.repository.save(curriculum);
  }
}

export default CurriculumController;
