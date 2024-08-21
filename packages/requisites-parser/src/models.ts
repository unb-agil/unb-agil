export type RequisitesExpression =
  | null
  | string
  | { and: RequisitesExpression[] }
  | { or: RequisitesExpression[] };
