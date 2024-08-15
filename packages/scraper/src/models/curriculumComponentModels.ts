export interface CurriculumComponentScraperOptions {
  programSigaaId: number;
}

export interface CurriculumComponent {
  curriculumSigaaId: string;
  componentSigaaId: string;
  type: 'MANDATORY' | 'ELECTIVE';
  recommendedPeriod?: number;
}
