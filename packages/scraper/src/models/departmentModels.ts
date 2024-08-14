export interface DepartmentScraperOptions {
  departmentSigaaIds?: number[];
}

export interface DepartmentData {
  acronym: string;
  title: string;
}

export interface Department extends DepartmentData {
  sigaaId: number;
}

export interface DepartmentParams {
  id?: number;
  acronym?: string;
  title?: string;
}
