export interface ComponentScraperOptions {
  programSigaaId?: number;
  componentId?: string;
}

export enum ComponentType {
  COURSE = 'DISCIPLINA',
  ACTIVITY = 'ATIVIDADE',
  BLOCK = 'BLOCO',
  MODULE = 'MÓDULO',
}

export interface ComponentDetails {
  title: string;
  type: string;
  department: string;
  prerequisites: string;
  corequisites: string;
  equivalences: string;
}

export interface Component {
  id: string;
  title: string;
  type: ComponentType;
  departmentId: number;
  prerequisites: RequisitesExpression;
  corequisites: RequisitesExpression;
  equivalences: RequisitesExpression;
}

export type RequisitesExpression =
  | string
  | { and: RequisitesExpression[] }
  | { or: RequisitesExpression[] };
