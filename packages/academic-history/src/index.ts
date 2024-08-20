import fs from 'fs';
import pdf2table from 'pdf2table';

import { AcademicHistory } from './models';

const academicHistory: AcademicHistory = {};

function handleProgramRow(row: string[]): void {
  const isProgramRow = row[0] === 'Curso:' && row[1].split(' - ').length > 1;

  if (isProgramRow) {
    const [programTitle, departmentAcronym] = row[1].split(' - ')[0].split('/');
    academicHistory.programTitle = programTitle;
    academicHistory.departmentAcronym = departmentAcronym;
  }
}

function handleCurriculumRow(row: string[]): void {
  const isCurriculumRow = row[0] === 'Currículo:';

  if (isCurriculumRow) {
    const curriculumId = row[1].split(' ')[0];
    academicHistory.curriculumId = curriculumId;
  }
}

function handleRequiredWorkloadRow(row: string[]): void {
  const isRequiredWorkloadRow = row[0] === 'Exigido';

  if (isRequiredWorkloadRow) {
    const [, mandatory, elective, complementary, total] = row;
    academicHistory.requiredWorkload = {
      mandatory: parseInt(mandatory, 10),
      elective: parseInt(elective, 10),
      complementary: parseInt(complementary, 10),
      total: parseInt(total, 10),
    };
  }
}

function handleCompletedWorkloadRow(row: string[]): void {
  const isCompletedWorkloadRow = row[0] === 'Integralizado';

  if (isCompletedWorkloadRow) {
    const [, mandatory, elective, complementary, total] = row;
    academicHistory.completedWorkload = {
      mandatory: parseInt(mandatory, 10),
      elective: parseInt(elective, 10),
      complementary: parseInt(complementary, 10),
      total: parseInt(total, 10),
    };
  }
}

function handleRemainingWorkloadRow(row: string[]): void {
  const isRemainingWorkloadRow = row[0] === 'Pendente';

  if (isRemainingWorkloadRow) {
    const [, mandatory, elective, complementary, total] = row;
    academicHistory.remainingWorkload = {
      mandatory: parseInt(mandatory, 10),
      elective: parseInt(elective, 10),
      complementary: parseInt(complementary, 10),
      total: parseInt(total, 10),
    };
  }
}

function handleRemainingCourses(rows: string[][], index: number): void {
  const isRemainingCoursesHeaderRow =
    rows[index].at(0) === 'Código' &&
    rows[index].at(1) === 'Componente Curricular' &&
    rows[index].at(2) === 'CH';

  if (!isRemainingCoursesHeaderRow) {
    return;
  }

  const remainingCourses = rows.slice(index + 1).filter((row) => {
    if (row.length === 3 || row.length === 4) {
      return row.at(-1)?.match(/\d+ h$/);
    }
  });

  const remainingCourseSigaaIds = remainingCourses.map((row) => row[0]);

  academicHistory.remainingCourseSigaaIds = Array.from(
    new Set(remainingCourseSigaaIds),
  );
}

export function extractAcademicHistory(filePath: string) {
  const file = fs.readFileSync(filePath);

  return new Promise<AcademicHistory>((resolve, reject) => {
    pdf2table.parse(file, (error: unknown, rows: string[][]) => {
      if (error) {
        return reject(error);
      }

      rows.forEach((row, index) => {
        handleProgramRow(row);
        handleCurriculumRow(row);
        handleRequiredWorkloadRow(row);
        handleCompletedWorkloadRow(row);
        handleRemainingWorkloadRow(row);
        handleRemainingCourses(rows, index);
      });

      resolve(academicHistory);
    });
  });
}
