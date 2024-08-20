import fs from 'fs';
import { Request } from 'express';
import { extractAcademicHistory } from '@unb-agil/academic-history';

class AcademicHistoryController {
  async extract(request: Request) {
    const filePath = request.file.path;

    try {
      return await extractAcademicHistory(filePath);
    } finally {
      fs.unlinkSync(filePath);
    }
  }
}

export default AcademicHistoryController;
