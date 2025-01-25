import fs from 'fs';
import pdf2table from 'pdf2table';
import { AcademicHistory } from './models';

class AcademicHistoryFile {
  private filePath: string;
  private academicHistory: AcademicHistory;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.academicHistory = {
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
  }

  private handleProgramRow(row: string[]) {
    const isProgramRow = row[0] === 'Curso:' && row[1].split(' - ').length > 1;

    if (!isProgramRow) {
      return;
    }

    const [programTitle, departmentAcronym] = row[1].split(' - ')[0].split('/');
    this.academicHistory.programTitle = programTitle;
    this.academicHistory.departmentAcronym = departmentAcronym;
  }

  private handleCurriculumRow(row: string[]) {
    const isCurriculumRow = row[0] === 'Currículo:';

    if (!isCurriculumRow) {
      return;
    }

    const curriculumId = row[1].split(' ')[0];
    this.academicHistory.curriculumSigaaId = curriculumId;
  }

  private handleRequiredWorkloadRow(row: string[]) {
    const isRequiredWorkloadRow = row[0] === 'Exigido';

    if (!isRequiredWorkloadRow) {
      return;
    }

    const [, mandatory, elective, complementary, total] = row;

    this.academicHistory.workloads.required = {
      mandatory: parseInt(mandatory),
      elective: parseInt(elective),
      complementary: parseInt(complementary),
      total: parseInt(total),
    };
  }

  private handleCompletedWorkloadRow(row: string[]) {
    const isCompletedWorkloadRow = row[0] === 'Integralizado';

    if (!isCompletedWorkloadRow) {
      return;
    }

    const [, mandatory, elective, complementary, total] = row;

    this.academicHistory.workloads.completed = {
      mandatory: parseInt(mandatory),
      elective: parseInt(elective),
      complementary: parseInt(complementary),
      total: parseInt(total),
    };
  }

  private handleRemainingWorkloadRow(row: string[]) {
    const isRemainingWorkloadRow = row[0] === 'Pendente';

    if (!isRemainingWorkloadRow) {
      return;
    }

    const [, mandatory, elective, complementary, total] = row;

    this.academicHistory.workloads.remaining = {
      mandatory: parseInt(mandatory),
      elective: parseInt(elective),
      complementary: parseInt(complementary),
      total: parseInt(total),
    };
  }

  private handleWorkloadRow(row: string[]) {
    this.handleRequiredWorkloadRow(row);
    this.handleCompletedWorkloadRow(row);
    this.handleRemainingWorkloadRow(row);
  }

  private handleCompletedComponentRow(row: string[]) {
    const isCompletedComponentRow =
      row.at(-1) === 'APR' || row.at(-1) === 'DISP';

    if (!isCompletedComponentRow) {
      return;
    }

    const componentSigaaId = row
      .slice(1, 3)
      .find((element) => element.match(/[A-Z]+\d+/));

    if (!componentSigaaId) {
      return;
    }

    this.academicHistory.components.completed.push(componentSigaaId);
  }

  private handleEquivalentComponentRow(row: string[]) {
    const isEquivalentComponentRow = row[0].match(/Cumpriu [A-Z]+\d+/);

    if (!isEquivalentComponentRow) {
      return;
    }

    const componentSigaaId = row[0].split(' ')[1];

    this.academicHistory.components.completed.push(componentSigaaId);
  }

  private handleRemainingComponentRow(row: string[]) {
    const isLastColumnWorkload = row.at(-1)?.match(/\d+ h$/);
    const hasRowLength = row.length === 3 || row.length === 4;
    const isRemainingComponentRow = isLastColumnWorkload && hasRowLength;

    if (!isRemainingComponentRow) {
      return;
    }

    const componentSigaaId = row[0];
    this.academicHistory.components.remaining.push(componentSigaaId);
  }

  async extract(): Promise<AcademicHistory> {
    const file = fs.readFileSync(this.filePath);

    return await new Promise<AcademicHistory>((resolve, reject) => {
      pdf2table.parse(file, (error: unknown, rows: string[][]) => {
        if (error) {
          return reject(error);
        }

        rows.forEach((row) => {
          this.handleProgramRow(row);
          this.handleCurriculumRow(row);
          this.handleWorkloadRow(row);
          this.handleCompletedComponentRow(row);
          this.handleEquivalentComponentRow(row);
          this.handleRemainingComponentRow(row);
        });

        resolve(this.academicHistory);
      });
    });
  }
}

export { AcademicHistoryFile };
export type { AcademicHistory };
