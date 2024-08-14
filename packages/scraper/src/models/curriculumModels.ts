import { Program } from './programModels';

export interface CurriculumScraperOptions {
  programId: Program['id'];
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
