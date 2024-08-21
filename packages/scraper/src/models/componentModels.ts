import { RequisitesExpression } from '@unb-agil/requisites-parser';

export interface ComponentScraperOptions {
  programSigaaId?: number;
  componentSigaaId?: string;
}

export enum ComponentType {
  COURSE = 'COURSE',
  ACTIVITY = 'ACTIVITY',
  BLOCK = 'BLOCK',
  MODULE = 'MODULE',
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
  sigaaId: string;
  title: string;
  type: ComponentType;
  departmentSigaaId: number;
  prerequisites: RequisitesExpression;
  corequisites: RequisitesExpression;
  equivalences: RequisitesExpression;
}
