import { Request } from 'express';
import { In } from 'typeorm';

import requisites, { RequisitesExpression } from '@unb-agil/requisites-parser';

import { AppDataSource } from '@/data-source';
import Curriculum from '@/entity/Curriculum';
import Component from '@/entity/Component';
import CurriculumComponent, {
  CurriculumComponentType,
} from '@/entity/CurriculumComponent';

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

type RequisitesGraph = Map<Component['sigaaId'], Component['sigaaId'][]>;

class RecommendationController {
  private curriculumRepository = AppDataSource.getRepository(Curriculum);
  private currCompRepository = AppDataSource.getRepository(CurriculumComponent);
  private componentRepository = AppDataSource.getRepository(Component);

  async getRecommendations(request: RecommendationRequest) {
    const { curriculumSigaaId, remainingComponentSigaaIds } = request.body;

    const curriculum = await this.getCurriculum(curriculumSigaaId);
    const components = await this.fetchParsedComponents(
      remainingComponentSigaaIds,
    );

    this.generateGraph(curriculum, components);
  }

  async getCurriculum(sigaaId: string) {
    return await this.curriculumRepository.findOneBy({ sigaaId });
  }

  async fetchParsedComponents(sigaaIds: string[]) {
    const components = await this.fetchComponents(sigaaIds);
    return this.parseComponents(components);
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
    this.handleRequisites(graph, curriculum, components);
  }

  initializeGraph(): RequisitesGraph {
    return new Map<Component['sigaaId'], Component['sigaaId'][]>();
  }

  async handleRequisites(
    graph: RequisitesGraph,
    curriculum: Curriculum,
    components: ParsedComponent[],
  ) {
    for (const component of components) {
      const sigaaIdOptions = requisites.options(component.prerequisites);
      const options = await this.fetchParsedOptionComponents(sigaaIdOptions);
      const bestOption = await this.evaluateOptions(curriculum, options);

      // this.updateGraph(graph, component, bestOptionComponents);
      this.handleRequisites(graph, curriculum, bestOption);
    }
  }

  async fetchParsedOptionComponents(options: Component['sigaaId'][][]) {
    return await Promise.all(
      options.map(async (option) => await this.fetchParsedComponents(option)),
    );
  }

  async evaluateOptions(curriculum: Curriculum, options: ParsedComponent[][]) {
    return options.reduce((bestOption, currentOption) => {
      const bestProportion = this.evaluateOption(curriculum, bestOption);
      const currentProportion = this.evaluateOption(curriculum, currentOption);

      return bestProportion > currentProportion ? bestOption : currentOption;
    });
  }

  async evaluateOption(curriculum: Curriculum, option: ParsedComponent[]) {
    const mandatoryComponents = option.filter(({ sigaaId }) =>
      this.isComponentMandatory(curriculum, sigaaId),
    );

    return mandatoryComponents.length / option.length;
  }

  async isComponentMandatory(
    curriculum: Curriculum,
    componentSigaaId: Component['sigaaId'],
  ) {
    const { type } = await this.getCurriculumComponentType(
      curriculum,
      componentSigaaId,
    );
    return type === CurriculumComponentType.MANDATORY;
  }

  async getCurriculumComponentType(
    curriculum: Curriculum,
    componentSigaaId: Component['sigaaId'],
  ) {
    return await this.currCompRepository.findOneBy({
      curriculum,
      componentSigaaId,
    });
  }
}

export default RecommendationController;
