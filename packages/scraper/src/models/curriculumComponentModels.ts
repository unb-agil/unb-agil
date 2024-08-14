export interface CurriculumComponentScraperOptions {
  programId: number;
}

export interface CurriculumComponent {
  curriculumId: string;
  componentId: string;
  isMandatory: boolean;
  recommendedPeriod?: number;
}
