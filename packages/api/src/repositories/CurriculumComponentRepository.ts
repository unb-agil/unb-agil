import { AppDataSource } from '#data-source.js';
import CurriculumComponent from '#entity/CurriculumComponent.js';

const CurriculumComponentRepository = AppDataSource.getRepository(
  CurriculumComponent,
).extend({});

export default CurriculumComponentRepository;
