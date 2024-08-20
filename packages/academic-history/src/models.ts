export interface Workload {
  mandatory: number;
  elective: number;
  complementary: number;
  total: number;
}

export interface AcademicHistory {
  programTitle?: string;
  departmentAcronym?: string;
  curriculumId?: string;
  requiredWorkload?: Workload;
  completedWorkload?: Workload;
  remainingWorkload?: Workload;
  remainingCourseSigaaIds?: string[];
}
