import { PROGRAM_CURRICULA_URL } from '@/constants';

export function getProgramCurriculaUrl(programId: number): string {
  return `${PROGRAM_CURRICULA_URL}&id=${programId}`;
}
