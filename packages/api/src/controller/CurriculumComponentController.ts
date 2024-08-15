import { Request } from 'express';
import { AppDataSource } from '@/data-source';
import Curriculum from '@/entity/Curriculum';
import Component from '@/entity/Component';
import CurriculumComponent from '@/entity/CurriculumComponent';

class CurriculumComponentController {
  private repository = AppDataSource.getRepository(CurriculumComponent);
  private curriculumRepository = AppDataSource.getRepository(Curriculum);
  private componentRepository = AppDataSource.getRepository(Component);

  async batchSaveOrUpdate(request: Request<never, CurriculumComponent[]>) {
    const curriculumComponents = request.body;
    const newCurriculumComponents = [];

    for (const curriculumComponent of curriculumComponents) {
      const curriculum = await this.curriculumRepository.findOneBy({
        sigaaId: curriculumComponent.curriculumSigaaId,
      });

      const component = await this.componentRepository.findOneBy({
        sigaaId: curriculumComponent.componentSigaaId,
      });

      curriculumComponent.curriculum = curriculum;
      curriculumComponent.component = component;

      const existingCurriculumComponent = await this.repository.findOneBy({
        curriculum,
        component,
      });

      if (existingCurriculumComponent) {
        existingCurriculumComponent.type = curriculumComponent.type;
        existingCurriculumComponent.percentagePrequisite =
          curriculumComponent.percentagePrequisite;

        newCurriculumComponents.push(existingCurriculumComponent);
      } else {
        newCurriculumComponents.push(curriculumComponent);
      }
    }

    return await this.repository.save(newCurriculumComponents);
  }
}

export default CurriculumComponentController;
