import { Request } from 'express';
import { AcademicHistory } from '@unb-agil/academic-history';
import CurriculumRepository from '@/repositories/CurriculumRepository';
import RequisitesGraph from './graph';
import Recommendation from './recommendation';

type RecommendationRequest = Request<never, never, AcademicHistory>;

const maxWorkloadByPeriod = Infinity;

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
    await graph.generate();

    const options = { maxWorkloadByPeriod };
    const recommendation = new Recommendation(curriculum, graph, options);
    await recommendation.generate();

    return recommendation.recommendation;
  }
}
