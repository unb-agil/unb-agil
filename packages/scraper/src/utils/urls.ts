import {
  DEPARTMENT_PRESENTATION_BASE_URL,
  PROGRAM_CURRICULA_URL,
} from '@/constants';

export function getDepartmentPresentationUrl(departmentId: number): string {
  return `${DEPARTMENT_PRESENTATION_BASE_URL}?id=${departmentId}`;
}

export function getProgramCurriculaUrl(programId: number): string {
  return `${PROGRAM_CURRICULA_URL}&id=${programId}`;
}
