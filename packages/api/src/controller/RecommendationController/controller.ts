import { Request } from 'express';
import { AcademicHistory } from '@unb-agil/academic-history';
import CurriculumRepository from '#repositories/CurriculumRepository.js';
import RequisitesGraph from './graph';
import Recommendation, { RecommendationOptions } from './recommendation';

type RecommendationRequest = Request<
  never,
  RecommendationOptions,
  AcademicHistory
>;

export default class RecommendationController {
  async recommend(request: RecommendationRequest) {
    const {
      curriculumSigaaId,
      components: { completed, enrolled, equivalentEnrolled, remaining },
    } = request.body;

    const { maxWorkloadByPeriod } = request.query;

    const parsedMaxWorkloadByPeriod = maxWorkloadByPeriod
      ? parseInt(maxWorkloadByPeriod as string)
      : Infinity;

    const curriculum = await CurriculumRepository.findOneBy({
      sigaaId: curriculumSigaaId,
    });

    const graph = new RequisitesGraph(
      curriculum,
      completed,
      enrolled.concat(equivalentEnrolled),
      remaining,
    );

    await graph.generate();

    const options = {
      maxWorkloadByPeriod: parsedMaxWorkloadByPeriod,
    };

    const recommendation = new Recommendation(
      curriculum,
      enrolled,
      graph,
      options,
    );
    await recommendation.generate();

    return recommendation.recommendation;
  }
}
