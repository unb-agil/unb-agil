import Component from '@/entity/Component';
import RequisitesGraph from './graph';
import CurriculumComponent from '@/entity/CurriculumComponent';
import { AppDataSource } from '@/data-source';
import Curriculum from '@/entity/Curriculum';

export default class Recommendation {
  private recommendation: Component[][] = [];

  private curriculumRepository = AppDataSource.getRepository(Curriculum);
  private currCompRepository = AppDataSource.getRepository(CurriculumComponent);

  public async generate(curriculumSigaaId: string, graph: RequisitesGraph) {
    const pathLengths = graph.getPathLengths();

    while (graph.size > 0) {
      const available = await graph.getRootComponents();

      const prioritized = await this.prioritizeComponents(
        curriculumSigaaId,
        available,
        pathLengths,
      );

      this.insertComponents(prioritized);
      graph.removeInsertedComponentsFromGraph();
    }
  }

  async findCurriculum(sigaaId: string) {
    return await this.curriculumRepository.findOneBy({ sigaaId });
  }

  private async getCurriculumComponent(
    curriculumSigaaId: string,
    componentSigaaId: Component['sigaaId'],
  ): Promise<CurriculumComponent | null> {
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

  private async prioritizeComponents(
    curriculumSigaaId: string,
    available: Component[],
    chains: Map<Component['sigaaId'], number>,
  ) {
    const recommendedPeriods = new Map<Component['sigaaId'], number>();

    await Promise.all(
      available.map(async (component) => {
        const curriculumComponent = await this.getCurriculumComponent(
          curriculumSigaaId,
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

  get ids() {
    return this.recommendation.map((period) =>
      period.map((component) => component.sigaaId),
    );
  }
}
