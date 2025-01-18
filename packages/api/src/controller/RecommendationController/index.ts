import { Request } from 'express';
import { AcademicHistory } from '@unb-agil/academic-history';
import CurriculumRepository from '@/repositories/CurriculumRepository';
import RequisitesGraph from './graph';
import Recommendation from './recommendation';

type RecommendationRequest = Request<never, never, AcademicHistory>;

const maxWorkloadByPeriod = 1000;

export default class RecommendationController {
  async recommend(request: RecommendationRequest) {
    const {
      curriculumSigaaId,
      components: { completed, remaining },
    } = request.body;

    const curriculum = await CurriculumRepository.findOneBy({
      sigaaId: curriculumSigaaId,
    });

    const graph = new RequisitesGraph(curriculum, completed, remaining);
    const recommendation = new Recommendation(curriculum, maxWorkloadByPeriod);

    await graph.generate();
    await recommendation.generate(graph);

    return recommendation.ids;
  }
}
