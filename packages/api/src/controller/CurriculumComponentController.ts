import { Request } from 'express';
import { AppDataSource } from '#data-source.js';
import Curriculum from '#entity/Curriculum.js';
import Component from '#entity/Component.js';
import CurriculumComponent from '#entity/CurriculumComponent.js';

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
        curriculum: { sigaaId: curriculum.sigaaId },
        component: { sigaaId: component.sigaaId },
      });

      if (existingCurriculumComponent) {
        existingCurriculumComponent.type = curriculumComponent.type;
        existingCurriculumComponent.recommendedPeriod =
          curriculumComponent.recommendedPeriod;

        newCurriculumComponents.push(existingCurriculumComponent);
      } else {
        newCurriculumComponents.push(curriculumComponent);
      }
    }

    return await this.repository.save(newCurriculumComponents);
  }

  async search(request: Request) {
    const { curriculumSigaaId, type, query } = request.query;

    const queryBuilder = this.repository
      .createQueryBuilder('curriculumComponent')
      .leftJoinAndSelect('curriculumComponent.component', 'component')
      .leftJoinAndSelect('curriculumComponent.curriculum', 'curriculum');

    if (curriculumSigaaId) {
      queryBuilder.andWhere('curriculum.sigaaId = :curriculumSigaaId', {
        curriculumSigaaId,
      });
    }

    if (type) {
      queryBuilder.andWhere('curriculumComponent.type = :type', { type });
    }

    if (query) {
      queryBuilder.andWhere('component.title LIKE :query', {
        query: `%${query}%`,
      });
    }

    const components = await queryBuilder.limit(10).getMany();

    return components.map((cc) => cc.component);
  }
}

export default CurriculumComponentController;
