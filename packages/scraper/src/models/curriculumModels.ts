import { Program } from './programModels';

export interface CurriculumScraperOptions {
  programSigaaId: Program['sigaaId'];
  curriculumIds?: Curriculum['id'][];
}

export interface CurriculumData {
  startPeriod: string;
  minPeriods: number;
  maxPeriods: number;
}

export interface Curriculum extends CurriculumData {
  id: string;
}
