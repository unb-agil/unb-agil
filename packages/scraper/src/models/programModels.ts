export interface ProgramScraperOptions {
  programIds: number[];
}

export interface ProgramData {
  title: string;
  departmentId: number;
}

export interface Program extends ProgramData {
  id: number;
}
