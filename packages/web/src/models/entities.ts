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
