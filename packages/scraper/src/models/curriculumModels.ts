import { Program } from './programModels';

export interface CurriculumScraperOptions {
  programSigaaId: Program['sigaaId'];
  curriculumSigaaIds?: Curriculum['sigaaId'][];
}

export interface CurriculumData {
  startPeriod: string;
  minPeriods: number;
  maxPeriods: number;
  programSigaaId: Program['sigaaId'];
}

export interface Curriculum extends CurriculumData {
  sigaaId: string;
}
