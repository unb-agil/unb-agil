import { AppDataSource } from '@/data-source';
import CurriculumComponent from '@/entity/CurriculumComponent';

const CurriculumComponentRepository = AppDataSource.getRepository(
  CurriculumComponent,
).extend({});

export default CurriculumComponentRepository;
