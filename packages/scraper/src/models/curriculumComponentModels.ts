export interface CurriculumComponentScraperOptions {
  programSigaaId: number;
}

export interface CurriculumComponent {
  curriculumId: string;
  componentId: string;
  isMandatory: boolean;
  recommendedPeriod?: number;
}
