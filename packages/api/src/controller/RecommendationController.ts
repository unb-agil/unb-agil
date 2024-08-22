import { Request } from 'express';
import { In } from 'typeorm';

import requisites from '@unb-agil/requisites-parser';

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
    const components = await this.findComponents(componentIds);

    await this.generateGraph(curriculum, components);
  }

  async findCurriculum(sigaaId: string) {
    return await this.curriculumRepository.findOneBy({ sigaaId });
  }

  async findComponents(sigaaIds: string[]) {
    return await this.componentRepository.findBy({ sigaaId: In(sigaaIds) });
  }

  async generateGraph(curriculum: Curriculum, components: Component[]) {
    this.initializeGraph();
    await this.handleRequisites(curriculum, components);
  }

  initializeGraph() {
    this.graph = new Map<Component['sigaaId'], Component['sigaaId'][]>();
  }

  async handleRequisites(curriculum: Curriculum, components: Component[]) {
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
      options.map(async (option) => await this.findComponents(option)),
    );
  }

  async evaluateOptions(curriculum: Curriculum, options: Component[][]) {
    return options.reduce(async (bestOptionPromise, currentOption) => {
      const bestOption = await bestOptionPromise;

      const bestProportion = await this.evaluateOption(curriculum, bestOption);
      const currentProportion = await this.evaluateOption(
        curriculum,
        currentOption,
      );

      return currentProportion > bestProportion ? currentOption : bestOption;
    }, Promise.resolve(options[0]));
  }

  async evaluateOption(curriculum: Curriculum, option: Component[]) {
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
