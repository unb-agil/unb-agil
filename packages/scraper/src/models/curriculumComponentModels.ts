export interface CurriculumComponentScraperOptions {
  programSigaaId: number;
}

export interface CurriculumComponent {
  curriculumSigaaId: string;
  componentId: string;
  isMandatory: boolean;
  recommendedPeriod?: number;
}
