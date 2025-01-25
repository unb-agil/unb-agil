import fs from 'fs';
import { Request } from 'express';
import { AcademicHistoryFile } from '@unb-agil/academic-history';

class AcademicHistoryController {
  async extract(request: Request) {
    const filePath = request.file.path;
    const academicHistoryFile = new AcademicHistoryFile(filePath);

    try {
      return await academicHistoryFile.extract();
    } catch (error) {
      console.error(error);
    } finally {
      fs.unlinkSync(filePath);
    }
  }
}

export default AcademicHistoryController;
