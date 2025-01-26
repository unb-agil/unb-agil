import { In } from 'typeorm';
import Component from '@/entity/Component';
import Curriculum from '@/entity/Curriculum';
import ComponentRepository from '@/repositories/ComponentRepository';
import CurriculumComponentRepository from '@/repositories/CurriculumComponentRepository';
import RequisitesGraph from './graph';

export interface RecommendationOptions {
  maxWorkloadByPeriod: number;
}

export default class Recommendation {
  public recommendation: Component[][] = [];

  private curriculum: Curriculum;
  private enrolledComponentIds: Component['sigaaId'][];
  private graph: RequisitesGraph;
  private maxWorkloadByPeriod: number;
  private pathLengths = new Map<Component['sigaaId'], number>();

  constructor(
    curriculum: Curriculum,
    enrolledComponentIds: Component['sigaaId'][],
    graph: RequisitesGraph,
    options: RecommendationOptions,
  ) {
    this.curriculum = curriculum;
    this.enrolledComponentIds = enrolledComponentIds;
    this.graph = graph;
    this.maxWorkloadByPeriod = options.maxWorkloadByPeriod;

    this.pathLengths = this.graph.getPathLengths();
  }

  public async generate() {
    const components = await this.getPrioritizedComponents();
    components.forEach((component) => this.insert(component));

    const enrolledComponents = await ComponentRepository.findBy({
      sigaaId: In(this.enrolledComponentIds),
    });

    this.recommendation.unshift(enrolledComponents);
  }

  private async getRecommendationComponents() {
    return ComponentRepository.findBy({ sigaaId: In(this.graph.getAll()) });
  }

  private async getPrioritizedComponents() {
    const components = await this.getRecommendationComponents();
    const sigaaIds = components.map((component) => component.sigaaId);

    const curriculumComponents = await CurriculumComponentRepository.findBy({
      curriculum: this.curriculum,
      componentSigaaId: In(sigaaIds),
    });

    const recommendedPeriods = new Map(
      curriculumComponents.map((curriculumComponent) => [
        curriculumComponent.componentSigaaId,
        curriculumComponent.recommendedPeriod,
      ]),
    );

    return components.sort((a, b) => {
      const aPathLength = this.pathLengths.get(a.sigaaId) ?? 0;
      const bPathLength = this.pathLengths.get(b.sigaaId) ?? 0;
      const aRecommendedPeriod = recommendedPeriods.get(a.sigaaId) ?? Infinity;
      const bRecommendedPeriod = recommendedPeriods.get(b.sigaaId) ?? Infinity;

      if (aPathLength !== bPathLength) {
        return bPathLength - aPathLength;
      }

      return aRecommendedPeriod - bRecommendedPeriod;
    });
  }

  private getLatestRecommendedComponentIndex(
    componentIds: Component['sigaaId'][],
  ) {
    return componentIds.reduce((acc, componentId) => {
      const index = this.recommendation.findIndex((period) =>
        period.some((c) => c.sigaaId === componentId),
      );

      return Math.max(acc, index);
    }, -1);
  }

  private insert(component: Component) {
    const prerequisites = this.graph.getPrerequisites(component.sigaaId);
    const lastPrerequisiteIndex =
      this.getLatestRecommendedComponentIndex(prerequisites);

    const startPeriodIndex = lastPrerequisiteIndex + 1;

    for (let i = startPeriodIndex; i < this.recommendation.length; i++) {
      const period = this.recommendation[i];
      const totalWorkload = period.reduce((acc, c) => acc + c.totalWorkload, 0);

      if (totalWorkload + component.totalWorkload <= this.maxWorkloadByPeriod) {
        period.push(component);
        return;
      }
    }

    this.recommendation.push([component]);
  }
}
