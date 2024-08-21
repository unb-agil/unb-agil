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
  private graph: RequisitesGraph;
  private curriculumRepository = AppDataSource.getRepository(Curriculum);
  private currCompRepository = AppDataSource.getRepository(CurriculumComponent);
  private componentRepository = AppDataSource.getRepository(Component);

  async recommend(request: RecommendationRequest) {
    const { curriculumSigaaId, remainingComponentSigaaIds: componentIds } =
      request.body;

    const curriculum = await this.findCurriculum(curriculumSigaaId);
    const components = await this.findParsedComponents(componentIds);

    await this.generateGraph(curriculum, components);
  }

  async findCurriculum(sigaaId: string) {
    return await this.curriculumRepository.findOneBy({ sigaaId });
  }

  async findParsedComponents(sigaaIds: string[]) {
    const components = await this.findComponents(sigaaIds);
    return this.parseComponents(components);
  }

  async findComponents(sigaaIds: string[]) {
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
    this.initializeGraph();
    await this.handleRequisites(curriculum, components);
  }

  initializeGraph() {
    this.graph = new Map<Component['sigaaId'], Component['sigaaId'][]>();
  }

  async handleRequisites(
    curriculum: Curriculum,
    components: ParsedComponent[],
  ) {
    for (const component of components) {
      const sigaaIdOptions = requisites.options(component.prerequisites);

      if (sigaaIdOptions.length === 0) {
        this.updateGraph(component.sigaaId);
        continue;
      }

      if (sigaaIdOptions.length === 1) {
        this.updateGraph(component.sigaaId, sigaaIdOptions[0]);
        continue;
      }

      const options = await this.fetchParsedOptionComponents(sigaaIdOptions);
      const prerequisites = await this.evaluateOptions(curriculum, options);

      this.updateGraph(
        component.sigaaId,
        prerequisites.map(({ sigaaId }) => sigaaId),
      );

      await this.handleRequisites(curriculum, prerequisites);
    }
  }

  async fetchParsedOptionComponents(options: Component['sigaaId'][][]) {
    return await Promise.all(
      options.map(async (option) => await this.findParsedComponents(option)),
    );
  }

  async evaluateOptions(curriculum: Curriculum, options: ParsedComponent[][]) {
    let bestOption = options[0];
    let bestProportion = await this.evaluateOption(curriculum, bestOption);

    for (const currentOption of options) {
      const currentProportion = await this.evaluateOption(
        curriculum,
        currentOption,
      );

      if (currentProportion > bestProportion) {
        bestOption = currentOption;
        bestProportion = currentProportion;
      }
    }

    return bestOption;
  }

  async evaluateOption(curriculum: Curriculum, option: ParsedComponent[]) {
    const mandatoryStatuses = await Promise.all(
      option.map(({ sigaaId }) =>
        this.isComponentMandatory(curriculum, sigaaId),
      ),
    );

    const mandatoryComponents = option.filter(
      (_, index) => mandatoryStatuses[index],
    );

    return mandatoryComponents.length / option.length;
  }

  async isComponentMandatory(
    curriculum: Curriculum,
    componentSigaaId: Component['sigaaId'],
  ) {
    const curriculumComponent = await this.getCurriculumComponent(
      curriculum,
      componentSigaaId,
    );

    if (!curriculumComponent) {
      return false;
    }

    return curriculumComponent.type === CurriculumComponentType.MANDATORY;
  }

  async getCurriculumComponent(
    curriculum: Curriculum,
    componentSigaaId: Component['sigaaId'],
  ): Promise<CurriculumComponent | null> {
    try {
      return await this.currCompRepository.findOneByOrFail({
        curriculum,
        componentSigaaId,
      });
    } catch {
      return null;
    }
  }

  updateGraph(
    componentSigaaId: Component['sigaaId'],
    prerequisiteSigaaIds?: Component['sigaaId'][],
  ) {
    if (!prerequisiteSigaaIds || prerequisiteSigaaIds.length === 0) {
      this.graph.set('START', [
        ...(this.graph.get('START') ?? []),
        componentSigaaId,
      ]);
    } else {
      for (const prerequisiteSigaaId of prerequisiteSigaaIds) {
        this.graph.set(prerequisiteSigaaId, [
          ...(this.graph.get(prerequisiteSigaaId) ?? []),
          componentSigaaId,
        ]);
      }
    }
  }
}

export default RecommendationController;
