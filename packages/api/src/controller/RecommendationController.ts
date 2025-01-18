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
  private academicHistory: AcademicHistory;
  private graph: RequisitesGraph;
  private recommendation: Component[][] = [];

  private curriculumRepository = AppDataSource.getRepository(Curriculum);
  private currCompRepository = AppDataSource.getRepository(CurriculumComponent);
  private componentRepository = AppDataSource.getRepository(Component);

  async recommend(request: RecommendationRequest) {
    this.academicHistory = request.body;

    await this.generateGraph();
    await this.generateRecommendation();

    // return this.recommendation;
    // return only the components ids of recommendation
    return this.recommendation.map((period) => period.map((c) => c.sigaaId));
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

  async generateRecommendation() {
    const chains = this.countComponentChains();

    while (this.graph.size > 0) {
      const available = await this.getRootComponents();
      const prioritized = await this.prioritizeComponents(available, chains);
      this.insertComponents(prioritized);
      this.removeInsertedComponentsFromGraph();
    }
  }

  private initializeGraph() {
    this.graph = new Map<Component['sigaaId'], Component['sigaaId'][]>();
  }

  private async handleRequisites(components: Component[]) {
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

  private filterCompletedPrerequisites(prerequisites: RequisitesExpression) {
    const optionSigaaIds = requisites.options(prerequisites);

    return optionSigaaIds.map((option) =>
      option.filter(
        (component) =>
          !this.academicHistory.components.completed.includes(component),
      ),
    );
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

    if (!curriculumComponent) {
      return false;
    }

    return curriculumComponent.type === CurriculumComponentType.MANDATORY;
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

  private countComponentChains(): Map<Component['sigaaId'], number> {
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
  '';

  private async getRootComponents(): Promise<Component[]> {
    const available = this.graph.get('ROOT') ?? [];

    const components = await Promise.all(
      available?.map(async (sigaaId) => {
        const component = await this.componentRepository.findOneBy({ sigaaId });

        return component;
      }),
    );

    return components;
  }

  private async prioritizeComponents(
    available: Component[],
    chains: Map<Component['sigaaId'], number>,
  ) {
    const recommendedPeriods = new Map<Component['sigaaId'], number>();

    await Promise.all(
      available.map(async (component) => {
        const curriculumComponent = await this.getCurriculumComponent(
          component.sigaaId,
        );

        recommendedPeriods.set(
          component.sigaaId,
          curriculumComponent?.recommendedPeriod ?? 0,
        );
      }),
    );

    return available.sort((a, b) => {
      const aChainCount = chains.get(a.sigaaId) ?? 0;
      const bChainCount = chains.get(b.sigaaId) ?? 0;
      const aRecommendedPeriod = recommendedPeriods.get(a.sigaaId) ?? Infinity;
      const bRecommendedPeriod = recommendedPeriods.get(b.sigaaId) ?? Infinity;

      if (aChainCount !== bChainCount) {
        return bChainCount - aChainCount;
      }

      return aRecommendedPeriod - bRecommendedPeriod;
    });
  }

  private insertComponents(prioritized: Component[]) {
    const MAX_WORKLOAD_BY_PERIOD = 1000;

    for (const component of prioritized) {
      const periodIndex = this.recommendation.findIndex(
        (period) =>
          period.reduce((acc, c) => acc + c.totalWorkload, 0) +
            component.totalWorkload <=
          MAX_WORKLOAD_BY_PERIOD,
      );

      if (periodIndex !== -1) {
        this.recommendation[periodIndex].push(component);
      } else {
        this.recommendation.push([component]);
      }
    }
  }

  private removeInsertedComponentsFromGraph() {
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
}

export default RecommendationController;
