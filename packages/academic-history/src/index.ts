import path from 'path';
import fs from 'fs';
import pdf2table from 'pdf2table';

interface Workload {
  mandatory: number;
  elective: number;
  complementary: number;
  total: number;
}

interface AcademicHistory {
  programTitle?: string;
  departmentAcronym?: string;
  curriculumId?: string;
  requiredWorkload?: Workload;
  completedWorkload?: Workload;
  remainingWorkload?: Workload;
}

const RELATIVE_PATH = './historico_170105342.pdf';

const absolutePath = path.resolve(__dirname, RELATIVE_PATH);
const file = fs.readFileSync(absolutePath);

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

function callback(error: unknown, rows: string[][]) {
  if (error) {
    return console.log(error);
  }

  rows.forEach((row) => {
    handleProgramRow(row);
    handleCurriculumRow(row);
    handleRequiredWorkloadRow(row);
    handleCompletedWorkloadRow(row);
    handleRemainingWorkloadRow(row);
  });

  console.log(academicHistory);
}

pdf2table.parse(file, callback);
