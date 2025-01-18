import { In } from 'typeorm';
import Component from '@/entity/Component';
import Curriculum from '@/entity/Curriculum';
import ComponentRepository from '@/repositories/ComponentRepository';
import CurriculumComponentRepository from '@/repositories/CurriculumComponentRepository';
import RequisitesGraph from './graph';

export default class Recommendation {
  private curriculum: Curriculum;
  private maxWorkloadByPeriod: number;
  private recommendation: Component[][] = [];
  private pathLengths = new Map<Component['sigaaId'], number>();

  constructor(curriculum: Curriculum, maxWorkloadByPeriod: number) {
    this.curriculum = curriculum;
    this.maxWorkloadByPeriod = maxWorkloadByPeriod;
  }

  public async generate(graph: RequisitesGraph) {
    this.pathLengths = graph.getPathLengths();

    while (graph.size > 0) {
      const available = await ComponentRepository.findBy({
        sigaaId: In([graph.root]),
      });

      const prioritized = await this.prioritize(available);

      this.insert(prioritized);
      graph.removeInsertedComponentsFromGraph();
    }
  }

  private async prioritize(available: Component[]) {
    const curriculumComponents = await CurriculumComponentRepository.findBy({
      curriculum: this.curriculum,
      componentSigaaId: In(available.map((component) => component.sigaaId)),
    });

    const recommendedPeriods = new Map(
      curriculumComponents.map((curriculumComponent) => [
        curriculumComponent.componentSigaaId,
        curriculumComponent.recommendedPeriod,
      ]),
    );

    return available.sort((a, b) => {
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

  private insert(prioritized: Component[]) {
    for (const component of prioritized) {
      const periodIndex = this.recommendation.findIndex(
        (period) =>
          period.reduce((acc, c) => acc + c.totalWorkload, 0) +
            component.totalWorkload <=
          this.maxWorkloadByPeriod,
      );

      if (periodIndex !== -1) {
        this.recommendation[periodIndex].push(component);
      } else {
        this.recommendation.push([component]);
      }
    }
  }

  get ids() {
    return this.recommendation.map((period) =>
      period.map((component) => component.sigaaId),
    );
  }
}
