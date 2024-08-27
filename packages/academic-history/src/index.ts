import fs from 'fs';
import pdf2table from 'pdf2table';
import { AcademicHistory } from './models';

const academicHistory: AcademicHistory = {
  programTitle: '',
  departmentAcronym: '',
  curriculumSigaaId: '',
  components: {
    completed: [],
    remaining: [],
  },
  workloads: {
    required: {
      mandatory: 0,
      elective: 0,
      complementary: 0,
      total: 0,
    },
    completed: {
      mandatory: 0,
      elective: 0,
      complementary: 0,
      total: 0,
    },
    remaining: {
      mandatory: 0,
      elective: 0,
      complementary: 0,
      total: 0,
    },
  },
};

function handleProgramRow(row: string[]) {
  const isProgramRow = row[0] === 'Curso:' && row[1].split(' - ').length > 1;

  if (!isProgramRow) {
    return;
  }

  const [programTitle, departmentAcronym] = row[1].split(' - ')[0].split('/');
  academicHistory.programTitle = programTitle;
  academicHistory.departmentAcronym = departmentAcronym;
}

function handleCurriculumRow(row: string[]) {
  const isCurriculumRow = row[0] === 'Currículo:';

  if (!isCurriculumRow) {
    return;
  }

  const curriculumId = row[1].split(' ')[0];
  academicHistory.curriculumSigaaId = curriculumId;
}

function handleRequiredWorkloadRow(row: string[]) {
  const isRequiredWorkloadRow = row[0] === 'Exigido';

  if (!isRequiredWorkloadRow) {
    return;
  }

  const [, mandatory, elective, complementary, total] = row;

  academicHistory.workloads.required = {
    mandatory: parseInt(mandatory),
    elective: parseInt(elective),
    complementary: parseInt(complementary),
    total: parseInt(total),
  };
}

function handleCompletedWorkloadRow(row: string[]) {
  const isCompletedWorkloadRow = row[0] === 'Integralizado';

  if (!isCompletedWorkloadRow) {
    return;
  }

  const [, mandatory, elective, complementary, total] = row;

  academicHistory.workloads.completed = {
    mandatory: parseInt(mandatory),
    elective: parseInt(elective),
    complementary: parseInt(complementary),
    total: parseInt(total),
  };
}

function handleRemainingWorkloadRow(row: string[]) {
  const isRemainingWorkloadRow = row[0] === 'Pendente';

  if (!isRemainingWorkloadRow) {
    return;
  }

  const [, mandatory, elective, complementary, total] = row;

  academicHistory.workloads.remaining = {
    mandatory: parseInt(mandatory),
    elective: parseInt(elective),
    complementary: parseInt(complementary),
    total: parseInt(total),
  };
}

function handleWorkloadRow(row: string[]) {
  handleRequiredWorkloadRow(row);
  handleCompletedWorkloadRow(row);
  handleRemainingWorkloadRow(row);
}

function handleCompletedComponentRow(row: string[]) {
  const isCompletedComponentRow = row.at(-1) === 'APR';

  if (!isCompletedComponentRow) {
    return;
  }

  const componentSigaaId = row
    .slice(1, 3)
    .find((element) => element.match(/[A-Z]+\d+/));

  if (!componentSigaaId) {
    return;
  }

  academicHistory.components.completed.push(componentSigaaId);
}

function handleEquivalentComponentRow(row: string[]) {
  const isEquivalentComponentRow = row[0].match(/Cumpriu [A-Z]+\d+/);

  if (!isEquivalentComponentRow) {
    return;
  }

  const componentSigaaId = row[0].split(' ')[1];

  academicHistory.components.completed.push(componentSigaaId);
}

function handleRemainingComponentRow(row: string[]) {
  const isLastColumnWorkload = row.at(-1)?.match(/\d+ h$/);
  const hasRowLength = row.length === 3 || row.length === 4;
  const isRemainingComponentRow = isLastColumnWorkload && hasRowLength;

  if (!isRemainingComponentRow) {
    return;
  }

  const componentSigaaId = row[0];
  academicHistory.components.remaining.push(componentSigaaId);
}

export function extractAcademicHistory(filePath: string) {
  const file = fs.readFileSync(filePath);

  return new Promise<AcademicHistory>((resolve, reject) => {
    pdf2table.parse(file, (error: unknown, rows: string[][]) => {
      if (error) {
        return reject(error);
      }

      rows.forEach((row) => {
        console.log(row);
        handleProgramRow(row);
        handleCurriculumRow(row);
        handleWorkloadRow(row);
        handleCompletedComponentRow(row);
        handleEquivalentComponentRow(row);
        handleRemainingComponentRow(row);
      });

      resolve(academicHistory);
    });
  });
}

export type { AcademicHistory };
