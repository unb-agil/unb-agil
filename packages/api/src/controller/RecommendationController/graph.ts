import { In } from 'typeorm';
import requisites, { RequisitesExpression } from '@unb-agil/requisites-parser';
import Component from '@/entity/Component';
import Curriculum from '@/entity/Curriculum';
import { CurriculumComponentType } from '@/entity/CurriculumComponent';
import CurriculumComponentRepository from '@/repositories/CurriculumComponentRepository';
import ComponentRepository from '@/repositories/ComponentRepository';

export default class RequisitesGraph {
  private curriculum: Curriculum;
  private completedComponentIds: Component['sigaaId'][];
  private remainingComponentIds: Component['sigaaId'][];
  private graph = new Map<Component['sigaaId'], Component['sigaaId'][]>();

  constructor(
    curriculum: Curriculum,
    completedComponentsIds: Component['sigaaId'][],
    remainingComponentsIds: Component['sigaaId'][],
  ) {
    this.curriculum = curriculum;
    this.completedComponentIds = completedComponentsIds;
    this.remainingComponentIds = remainingComponentsIds;
  }

  async generate() {
    const components = await ComponentRepository.findBy({
      sigaaId: In(this.remainingComponentIds),
    });

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

  private filterCompletedPrerequisites(prerequisites: RequisitesExpression) {
    const optionSigaaIds = requisites.options(prerequisites);
    return optionSigaaIds.map((option) =>
      option.filter((id) => !this.completedComponentIds.includes(id)),
    );
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
    const curriculumComponent = await CurriculumComponentRepository.findOneBy({
      curriculum: this.curriculum,
      componentSigaaId,
    });

    return curriculumComponent
      ? curriculumComponent.type === CurriculumComponentType.MANDATORY
      : false;
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
    return await ComponentRepository.findBy({ sigaaId: In(sigaaIds) });
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

  get root() {
    return this.graph.get('ROOT');
  }

  async getRootComponents(): Promise<Component[]> {
    const available = this.graph.get('ROOT') ?? [];

    const components = await Promise.all(
      available?.map(
        async (sigaaId) => await ComponentRepository.findOneBy({ sigaaId }),
      ),
    );

    return components;
  }

  removeInsertedComponentsFromGraph() {
    const rootComponents = this.graph.get('ROOT');
    if (!rootComponents) {
      return;
    }

    this.graph.delete('ROOT');
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

    rootComponents.forEach((root) => this.graph.delete(root));
    const newBlockedComponents = new Set(
      Array.from(this.graph.values()).flat(),
    );

    const unblockedComponents = Array.from(componentsBlockedByRoot).filter(
      (component) => !newBlockedComponents.has(component),
    );

    if (unblockedComponents.length > 0) {
      this.graph.set('ROOT', unblockedComponents);
    }
  }

  get size() {
    return this.graph.size;
  }
}
