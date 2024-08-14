export interface ProgramScraperOptions {
  programSigaaId: number;
}

export interface ProgramData {
  title: string;
  departmentId: number;
}

export interface Program extends ProgramData {
  sigaaId: number;
}
