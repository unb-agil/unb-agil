export interface ProgramScraperOptions {
  programSigaaId: number;
}

export interface ProgramData {
  title: string;
  departmentSigaaId: number;
}

export interface Program extends ProgramData {
  sigaaId: number;
}
