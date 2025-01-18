import { In } from 'typeorm';

import requisites, { RequisitesExpression } from '@unb-agil/requisites-parser';
import { AcademicHistory } from '@unb-agil/academic-history';

import { AppDataSource } from '@/data-source';

import Component from '@/entity/Component';
import Curriculum from '@/entity/Curriculum';
import CurriculumComponent, {
  CurriculumComponentType,
} from '@/entity/CurriculumComponent';

export default class RequisitesGraph {
  private academicHistory: AcademicHistory;
  private graph = new Map<Component['sigaaId'], Component['sigaaId'][]>();

  private componentRepository = AppDataSource.getRepository(Component);
  private curriculumRepository = AppDataSource.getRepository(Curriculum);
  private currCompRepository = AppDataSource.getRepository(CurriculumComponent);

  async generate(academicHistory: AcademicHistory) {
    this.academicHistory = academicHistory;
    const components = await this.findComponents(
      this.academicHistory.components.remaining,
    );
    this.initializeGraph();
    await this.processComponents(components);
  }

  private initializeGraph() {
    this.graph = new Map<Component['sigaaId'], Component['sigaaId'][]>();
  }

  private async processComponents(components: Component[]) {
    for (const component of components) {
      await this.handleComponentRequisites(component);
    }
  }

  private async handleComponentRequisites(component: Component) {
    const remainingOptions = this.filterCompletedPrerequisites(
      component.prerequisites,
    );

    if (remainingOptions.length === 0) {
      this.updateGraph(component.sigaaId);
    } else if (remainingOptions.length === 1) {
      this.updateGraph(component.sigaaId, remainingOptions[0]);
    } else {
      const choosedOption = await this.chooseBestOption(remainingOptions);
      this.updateGraph(
        component.sigaaId,
        choosedOption.map(({ sigaaId }) => sigaaId),
      );
      await this.processComponents(choosedOption);
    }
  }

  private async chooseBestOption(options: Component['sigaaId'][][]) {
    const parsedOptions = await this.fetchParsedOptionComponents(options);
    return this.evaluateOptions(parsedOptions);
  }

  private async fetchParsedOptionComponents(options: Component['sigaaId'][][]) {
    return await Promise.all(
      options.map(async (option) => await this.findComponents(option)),
    );
  }

  private async evaluateOptions(options: Component[][]) {
    return options.reduce(async (bestOptionPromise, currentOption) => {
      const bestOption = await bestOptionPromise;
      const bestProportion = await this.evaluateOption(bestOption);
      const currentProportion = await this.evaluateOption(currentOption);
      return currentProportion > bestProportion ? currentOption : bestOption;
    }, Promise.resolve(options[0]));
  }

  private async evaluateOption(option: Component[]) {
    const mandatoryStatuses = await Promise.all(
      option.map(({ sigaaId }) => this.isComponentMandatory(sigaaId)),
    );
    const mandatoryComponents = option.filter(
      (_, index) => mandatoryStatuses[index],
    );
    return mandatoryComponents.length / option.length;
  }

  private async isComponentMandatory(componentSigaaId: Component['sigaaId']) {
    const curriculumComponent =
      await this.getCurriculumComponent(componentSigaaId);
    return curriculumComponent
      ? curriculumComponent.type === CurriculumComponentType.MANDATORY
      : false;
  }

  private async getCurriculumComponent(
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

  private async findCurriculum(sigaaId: string) {
    return await this.curriculumRepository.findOneBy({ sigaaId });
  }

  private filterCompletedPrerequisites(prerequisites: RequisitesExpression) {
    const optionSigaaIds = requisites.options(prerequisites);
    return optionSigaaIds.map((option) =>
      option.filter(
        (component) =>
          !this.academicHistory.components.completed.includes(component),
      ),
    );
  }

  private updateGraph(
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
      addComponentToGraph('ROOT', componentSigaaId);
    } else {
      prerequisiteSigaaIds.forEach((prerequisiteSigaaId) => {
        addComponentToGraph(prerequisiteSigaaId, componentSigaaId);
      });
    }
  }

  private async findComponents(sigaaIds: string[]) {
    return await this.componentRepository.findBy({ sigaaId: In(sigaaIds) });
  }

  getPathLengths(): Map<Component['sigaaId'], number> {
    const longestChainCache = new Map<Component['sigaaId'], number>();

    const calculateLongestChain = (sigaaId: Component['sigaaId']): number => {
      if (longestChainCache.has(sigaaId)) {
        const cachedValue = longestChainCache.get(sigaaId);

        if (cachedValue !== undefined) {
          return cachedValue;
        }
      }

      const prerequisites = this.graph.get(sigaaId) || [];
      if (prerequisites.length === 0) {
        longestChainCache.set(sigaaId, 1);
        return 1;
      }

      const longestChain =
        Math.max(
          ...prerequisites.map((prerequisite) =>
            calculateLongestChain(prerequisite),
          ),
        ) + 1;

      longestChainCache.set(sigaaId, longestChain);

      return longestChain;
    };

    for (const sigaaId of this.graph.keys()) {
      calculateLongestChain(sigaaId);
    }

    return longestChainCache;
  }

  async getRootComponents(): Promise<Component[]> {
    const available = this.graph.get('ROOT') ?? [];

    const components = await Promise.all(
      available?.map(async (sigaaId) => {
        const component = await this.componentRepository.findOneBy({ sigaaId });

        return component;
      }),
    );

    return components;
  }

  removeInsertedComponentsFromGraph() {
    // Remove root
    const rootComponents = this.graph.get('ROOT');

    if (!rootComponents) {
      return;
    }

    this.graph.delete('ROOT');

    // Get components that root components were blocking
    const componentsBlockedByRoot = new Set<string>();

    for (const rootComponent of rootComponents) {
      const blockedComponents = this.graph.get(rootComponent);

      if (!blockedComponents) {
        continue;
      }

      blockedComponents.forEach((blockedComponent) =>
        componentsBlockedByRoot.add(blockedComponent),
      );
    }

    // Delete root components
    rootComponents.forEach((root) => this.graph.delete(root));

    const newBlockedComponents = new Set(
      Array.from(this.graph.values()).flat(),
    );

    // Compare componentsBlockedByRoot with newBlockedComponents. Return the components that are not in newBlockedComponents
    const unblockedComponents = Array.from(componentsBlockedByRoot).filter(
      (component) => !newBlockedComponents.has(component),
    );

    // add unblocked components to the root
    if (unblockedComponents.length > 0) {
      this.graph.set('ROOT', unblockedComponents);
    }
  }

  get size() {
    return this.graph.size;
  }
}
