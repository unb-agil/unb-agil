export interface CurriculumComponentScraperOptions {
  curriculumIds: string[];
}

export interface CurriculumComponent {
  curriculumId: string;
  componentId: string;
  isMandatory: boolean;
  recommendedPeriod?: number;
}
