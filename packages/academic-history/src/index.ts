import path from 'path';
import fs from 'fs';
import pdf2table from 'pdf2table';

const RELATIVE_PATH = './historico_170105342.pdf';

const absolutePath = path.resolve(__dirname, RELATIVE_PATH);
const file = fs.readFileSync(absolutePath);

function getProgram(rows: string[][]) {
  const [programTitle, departmentAcronym] = rows[10][1]
    .split(' - ')[0]
    .split('/');

  return {
    programTitle,
    departmentAcronym,
  };
}

function getCurriculumId(rows: string[][]) {
  const curriculumRow = rows[13];
  const curriculumId = curriculumRow[1].split(' ')[0];

  return curriculumId;
}

function callback(error: unknown, rows: string[][]) {
  if (error) {
    return console.log(error);
  }

  const { programTitle, departmentAcronym } = getProgram(rows);
  const curriculumId = getCurriculumId(rows);

  console.log({ departmentAcronym, programTitle, curriculumId });
}

pdf2table.parse(file, callback);
