export interface Workload {
  mandatory: number;
  elective: number;
  complementary: number;
  total: number;
}

export interface Workloads {
  required: Workload;
  completed: Workload;
  remaining: Workload;
}

export interface Components {
  completed: string[];
  remaining: string[];
}

export interface AcademicHistory {
  programTitle: string;
  departmentAcronym: string;
  curriculumSigaaId: string;
  workloads: Workloads;
  components: Components;
}
