import { Request } from 'express';
import { In } from 'typeorm';

import requisites, { RequisitesExpression } from '@unb-agil/requisites-parser';
import { AcademicHistory } from '@unb-agil/academic-history';

import { AppDataSource } from '@/data-source';
import Curriculum from '@/entity/Curriculum';
import Component from '@/entity/Component';
import CurriculumComponent, {
  CurriculumComponentType,
} from '@/entity/CurriculumComponent';

type RecommendationRequest = Request<never, never, AcademicHistory>;
type RequisitesGraph = Map<Component['sigaaId'], Component['sigaaId'][]>;

class RecommendationController {
  private graph: RequisitesGraph;
  private academicHistory: AcademicHistory;

  private curriculumRepository = AppDataSource.getRepository(Curriculum);
  private currCompRepository = AppDataSource.getRepository(CurriculumComponent);
  private componentRepository = AppDataSource.getRepository(Component);

  async recommend(request: RecommendationRequest) {
    this.academicHistory = request.body;

    await this.generateGraph();
    return Object.fromEntries(this.graph);
  }

  async findCurriculum(sigaaId: string) {
    return await this.curriculumRepository.findOneBy({ sigaaId });
  }

  async findComponents(sigaaIds: string[]) {
    return await this.componentRepository.findBy({ sigaaId: In(sigaaIds) });
  }

  async generateGraph() {
    const {
      components: { remaining },
    } = this.academicHistory;

    const components = await this.findComponents(remaining);

    this.initializeGraph();
    await this.handleRequisites(components);
  }

  initializeGraph() {
    this.graph = new Map<Component['sigaaId'], Component['sigaaId'][]>();
  }

  async handleRequisites(components: Component[]) {
    for (const { sigaaId, prerequisites } of components) {
      const remainingOptions = this.filterCompletedPrerequisites(prerequisites);

      if (remainingOptions.length === 0) {
        this.updateGraph(sigaaId);
        continue;
      }

      if (remainingOptions.length === 1) {
        this.updateGraph(sigaaId, remainingOptions[0]);
        continue;
      }

      const options = await this.fetchParsedOptionComponents(remainingOptions);
      const choosedOption = await this.evaluateOptions(options);

      this.updateGraph(
        sigaaId,
        choosedOption.map(({ sigaaId }) => sigaaId),
      );

      await this.handleRequisites(choosedOption);
    }
  }

  filterCompletedPrerequisites(prerequisites: RequisitesExpression) {
    const optionSigaaIds = requisites.options(prerequisites);

    return optionSigaaIds.map((option) =>
      option.filter(
        (component) =>
          !this.academicHistory.components.completed.includes(component),
      ),
    );
  }

  async fetchParsedOptionComponents(options: Component['sigaaId'][][]) {
    return await Promise.all(
      options.map(async (option) => await this.findComponents(option)),
    );
  }

  async evaluateOptions(options: Component[][]) {
    return options.reduce(async (bestOptionPromise, currentOption) => {
      const bestOption = await bestOptionPromise;

      const bestProportion = await this.evaluateOption(bestOption);
      const currentProportion = await this.evaluateOption(currentOption);

      return currentProportion > bestProportion ? currentOption : bestOption;
    }, Promise.resolve(options[0]));
  }

  async evaluateOption(option: Component[]) {
    const mandatoryStatuses = await Promise.all(
      option.map(({ sigaaId }) => this.isComponentMandatory(sigaaId)),
    );

    const mandatoryComponents = option.filter(
      (_, index) => mandatoryStatuses[index],
    );

    return mandatoryComponents.length / option.length;
  }

  async isComponentMandatory(componentSigaaId: Component['sigaaId']) {
    const curriculumComponent =
      await this.getCurriculumComponent(componentSigaaId);

    if (!curriculumComponent) {
      return false;
    }

    return curriculumComponent.type === CurriculumComponentType.MANDATORY;
  }

  async getCurriculumComponent(
    componentSigaaId: Component['sigaaId'],
  ): Promise<CurriculumComponent | null> {
    const { curriculumSigaaId } = this.academicHistory;
    const curriculum = await this.findCurriculum(curriculumSigaaId);

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
    const addComponentToGraph = (
      key: string,
      componentId: Component['sigaaId'],
    ) => {
      const existingComponents = new Set(this.graph.get(key) ?? []);
      if (!existingComponents.has(componentId)) {
        existingComponents.add(componentId);
        this.graph.set(key, Array.from(existingComponents));
      }
    };

    if (!prerequisiteSigaaIds || prerequisiteSigaaIds.length === 0) {
      addComponentToGraph('START', componentSigaaId);
    } else {
      prerequisiteSigaaIds.forEach((prerequisiteSigaaId) => {
        addComponentToGraph(prerequisiteSigaaId, componentSigaaId);
      });
    }
  }
}

export default RecommendationController;
