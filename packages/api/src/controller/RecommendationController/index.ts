import { Request } from 'express';

import { AcademicHistory } from '@unb-agil/academic-history';

import RequisitesGraph from './graph';
import Recommendation from './recommendation';

type RecommendationRequest = Request<never, never, AcademicHistory>;

export default class RecommendationController {
  async recommend(request: RecommendationRequest) {
    const academicHistory = request.body;
    const { curriculumSigaaId } = academicHistory;

    const graph = new RequisitesGraph();
    const recommendation = new Recommendation();

    await graph.generate(academicHistory);
    await recommendation.generate(curriculumSigaaId, graph);

    return recommendation.ids;
  }
}
