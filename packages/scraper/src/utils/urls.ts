import { DEPARTMENT_PRESENTATION_BASE_URL } from '@/constants';

export function getDepartmentPresentationUrl(departmentId: number): string {
  return `${DEPARTMENT_PRESENTATION_BASE_URL}?id=${departmentId}`;
}
