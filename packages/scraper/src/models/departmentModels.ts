export interface DepartmentScraperOptions {
  departmentIds?: number[];
}

export interface DepartmentData {
  acronym: string;
  title: string;
}

export interface Department extends DepartmentData {
  id: number;
}

export interface DepartmentParams {
  id?: number;
  acronym?: string;
  title?: string;
}
