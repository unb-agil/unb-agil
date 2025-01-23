import { RequisitesExpression } from '@unb-agil/requisites-parser';

export interface Component {
  sigaaId: string;
  title: string;
  type: string;
  totalWorkload: number;
  prerequisites: RequisitesExpression;
  corequisites: RequisitesExpression;
  equivalences: RequisitesExpression;
  departmentSigaaId: string;
}

export interface Curriculum {
  sigaaId: string;
  isActive?: boolean;
  startYear?: number;
  startPeriod?: number;
  minPeriods?: number;
  maxPeriods?: number;
  minPeriodWorkload?: number;
  maxPeriodWorkload?: number;
  minWorkload?: number;
  mandatoryComponentsWorkload?: number;
  minElectiveComponentsWorkload?: number;
  maxElectiveComponentsWorkload?: number;
  minComplementaryComponentsWorkload?: number;
  maxComplementaryComponentsWorkload?: number;
}
