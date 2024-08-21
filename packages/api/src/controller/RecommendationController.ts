import { Request } from 'express';
import { In } from 'typeorm';

import requisites, { RequisitesExpression } from '@unb-agil/requisites-parser';

import { AppDataSource } from '@/data-source';
import Curriculum from '@/entity/Curriculum';
import Component from '@/entity/Component';

interface RecommendationRequestBody {
  curriculumSigaaId: string;
  maxCreditsByPeriod: number;
  remainingComponentSigaaIds: string[];
}

type RecommendationRequest = Request<never, never, RecommendationRequestBody>;

type RequisiteType = 'prerequisites' | 'corequisites' | 'equivalences';

type ParsedComponent = Omit<Component, RequisiteType> & {
  prerequisites: RequisitesExpression;
  corequisites: RequisitesExpression;
  equivalences: RequisitesExpression;
};

class RecommendationController {
  private curriculumRepository = AppDataSource.getRepository(Curriculum);
  private componentRepository = AppDataSource.getRepository(Component);

  async getRecommendations(request: RecommendationRequest) {
    const { curriculumSigaaId, remainingComponentSigaaIds } = request.body;

    const curriculum = await this.getCurriculum(curriculumSigaaId);
    const components = await this.fetchComponents(remainingComponentSigaaIds);
    const parsedComponents = this.parseComponents(components);

    this.generateGraph(curriculum, parsedComponents);
  }

  async getCurriculum(sigaaId: string) {
    return await this.curriculumRepository.findOneBy({ sigaaId });
  }

  async fetchComponents(sigaaIds: string[]) {
    return await this.componentRepository.findBy({ sigaaId: In(sigaaIds) });
  }

  parseComponents(components: Component[]): ParsedComponent[] {
    return components.map((component) => ({
      ...component,
      prerequisites: requisites.parse(component.prerequisites),
      corequisites: requisites.parse(component.corequisites),
      equivalences: requisites.parse(component.equivalences),
    }));
  }

  async generateGraph(curriculum: Curriculum, components: ParsedComponent[]) {
    const graph = this.initializeGraph();
    console.log(curriculum);
    console.log(components);
    console.log(graph);
  }

  initializeGraph() {
    return new Map<Component['sigaaId'], Component['sigaaId'][]>();
  }
}

export default RecommendationController;
